# Project Tasks: Privacy Guard Extension v1.5

This document outlines the tasks for version 1.5 of the Privacy Guard extension, focusing on improving the intelligence of the analysis by upgrading the system prompt.

| Task ID | Status | Task Description                                                                                                                            | Priority | Dependencies |
| :------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :----------- |
| 25      | [x]    | **Core: Upgrade System Prompt** - Rewrite the system prompt in `api/analyze.js` to be more detailed and context-aware, instructing the LLM to act as a "Privacy Policy Analyst." | High     | -            |
| 26      | [x]    | **Testing: Verify Enhanced Analysis** - Thoroughly test the extension with various privacy policies to ensure the new prompt provides a more accurate and intelligent analysis. | High     | 25           |
