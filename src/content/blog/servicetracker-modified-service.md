---
title: "A discussion about ServiceTrackerCustomizer.modifiedService"
date: 2026-03-29T00:20:34+08:00
updated: 2026-03-29T00:27:00+08:00
tags: ["java", "osgi"]
lang: en
memo: memos/BZ8KKU9J4LpvrUf5Ei6YhD
---
Discussed with Gemini for a deep dive of the `ServiceTrackerCustomizer`'s `modifiedService` method.

## Gemini Summary of the discussion

| **Topic** | **Key Takeaway** |
| --- | --- |
| **Object Identity** | The `ServiceReference` passed to `modifiedService` is the **exact same instance** as the one in `addingService`. Only the properties inside it have changed. |
| **Tracking State** | If your tracked object (tuple, config, etc.) is built using specific properties, it will **not** update automatically. You must refresh it manually in `modifiedService`. |
| **Lifecycle Safety** | **Never** call `addingService` or `removedService` manually. It bypasses the tracker's internal map and messes up OSGi's internal service use-counts. |
| **Updating the Tracker** | Since `modifiedService` returns `void`, use a **Wrapper** (like `AtomicReference`) or a **Mutable Object** as your tracked type so you can swap out the internal logic while the tracker holds the same container. |
| **Reference Counting** | If you re-fetch the service instance using `context.getService()` during an update, you must call `context.ungetService()` on the old one to keep the framework's "use counts" balanced. |

## Principles:

1. When creating `ServiceTracker`, create a Filter for the relevant properties; this way, the `ServiceTrackerCustomizer.modifiedService` method is only notified when these relevant properties are changed.
2. Before implementing `modifiedService`, ask yourself, are the properties in this tracker’s scope really able to change? If not, leave `modifiedService` empty.
3. If the tracked object returned by the `addingService` method is built using specific properties, the `modifiedService` method must be able to refresh it when the properties change.
    1. Since this method returns `void`, it can’t directly modify the `ServiceTracker`'s internal state. Consider returning a **wrapper** (like `AtomicReference`) or a **mutable object** as the tracked object, which is updatable in `modifiedService`.
4. It’s generally a bad practice to just simply delegate to `removedService` and `addingService`. In a design perspective, they should only be called by the framework (`ServiceTracker`) as they are event callbacks. Extract common logics for tracked object’s constuction/destruction into separate methods.
    1. Mind Reference Counting. `BundleContext.getService()` and `BundleContext.ungetService` must be called in pair to keep the framework’s use counts balanced.

An example:

```Java
@Override
public void modifiedService(ServiceReference<S> sr, AtomicReference<MyLogic> wrapper) {

    MyLogic oldLogic = wrapper.get();
    if (oldLogic != null) {
		    // clean up
        oldLogic.stop(); 

        context.ungetService(sr);
    }

    S serviceInstance = context.getService(sr);
    MyLogic newLogic = new MyLogic(serviceInstance, sr);
    newLogic.start();

    wrapper.set(newLogic);
}
```
