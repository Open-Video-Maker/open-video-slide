/// <reference types="@welldone-software/why-did-you-render" />
import React from "react";

if (process.env.NODE_ENV === "development") {
  if (typeof window !== "undefined") {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
      // trackAllPureComponents: true,
      // trackHooks: true,
      // logOwnerReasons: true,
      // collapseGroups: true,
      // include: [/./],

      // This is for testing, remove it, if you don't want to log on different values
      // logOnDifferentValues: true,
    });
  }
}
