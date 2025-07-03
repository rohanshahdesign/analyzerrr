# Project Tasks: Privacy Guard Extension v1.4

This document outlines the tasks for version 1.4 of the Privacy Guard extension, focusing on fixing the content script, improving the analysis, and enhancing the UI.

| Task ID | Status | Task Description                                                                                                                            | Priority | Dependencies |
| :------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :----------- |
| 19      | [x]    | **Bugfix: Fix `content.js`** - Rewrite `content.js` to correctly find the privacy policy link and send the URL to the background script.        | High     | -            |
| 20      | [x]    | **Feature: Analyze All Available Content** - Ensure all text on the privacy policy page is sent for analysis, even if it contains external links. | High     | 19           |
| 21      | [x]    | **Feature: Mention Redirects** - Update the Gemini prompt to note if the policy redirects to another policy.                                  | High     | 20           |
| 22      | [x]    | **UI: Add Loader Animation** - Implement a CSS loader in the popup to indicate when an analysis is in progress.                               | High     | -            |
| 23      | [x]    | **Core: Follow Linked Policies** - Enhance the content script to find and fetch the content of linked documents (e.g., cookie policy) and combine it with the main policy text for a more comprehensive analysis. | High     | 19           |
| 24      | [x]    | **Testing: Verify Enhancements** - Thoroughly test the new features to ensure they are working correctly.                                     | High     | 23           |
