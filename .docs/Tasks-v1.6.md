# Project Tasks: Privacy Guard Extension v1.6

This document outlines the tasks for version 1.6 of the Privacy Guard extension, focusing on creating a hyper-specific system prompt and a better testing workflow.

| Task ID | Status | Task Description                                                                                                                            | Priority | Dependencies |
| :------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :----------- |
| 27      | [ ]    | **Core: Hyper-Specific System Prompt** - Rewrite the system prompt in `api/analyze.js` to be extremely detailed, forcing the LLM to prioritize the main policy text and extract the most relevant sentences. | High     | -            |
| 28      | [ ]    | **Testing: Create Prompt-Testing Script** - Create a Node.js script to quickly test different prompts with the privacy policy text, allowing for faster iteration and debugging. | High     | -            |
| 29      | [ ]    | **Testing: Verify Enhanced Analysis** - Use the new script to test and refine the prompt until it provides accurate and relevant results.      | High     | 28           |
