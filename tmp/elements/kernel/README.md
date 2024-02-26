## Kerned purpose
I want to be able to create a framework with assets as a service.

This way, it loads only the minimal assets and in real time, when it needs something, he checks the registry if that 
has already been loaded or if not, load it, process it, store it and return the outcome.

### Registry 

#### Core concepts
* Files are required at runtime instead of loading everything in the loading
* Everything should be stored as a chunk
* Templates should be processed at build time.
* When a file is required, if wasnt loaded, load it, cache it and return it 
* When a template is required:
    1. Check if has been processed before
    1.1. If not:
    1.1.1. Process it (cleanup, parse expressions, map funcionality) 
    1.1.2. Cache the processed template and it's funcionality map 
    1.1.3. Add the webcomponent template element to the head of the project
    1.1.4. Store the template's functionality globally
    4. Return the template as a promise