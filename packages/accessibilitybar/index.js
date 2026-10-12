/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "cantooWebOpensource:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkCantooWebOpensource"] = self["webpackChunkCantooWebOpensource"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/utils/iframes.ts
var _a;
const currentScriptTag = document.currentScript ||
    Array.from(document.querySelectorAll('script')).find(script => script.src &&
        (script.src.includes('cantoo.fr') ||
            script.src.includes('standalone/index.js') ||
            script.src.includes('opensource/index.js')));
const currentScriptSrc = (_a = currentScriptTag === null || currentScriptTag === void 0 ? void 0 : currentScriptTag.getAttribute) === null || _a === void 0 ? void 0 : _a.call(currentScriptTag, 'src');
function detectAndInjectIntoIframes() {
    const injectedIframes = new WeakSet();
    const iframeObservers = new Map();
    const addScriptTagToIframe = (iframe) => {
        var _a;
        const iframeDoc = iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
        console.log('Adding Cantoo-web script tag to iframe', iframe);
        if (!iframeDoc) {
            console.log('No iframe document, skipping injection');
            return;
        }
        // Check if script is already injected
        const existingScript = iframeDoc.querySelector('#cantoo-web-extension');
        if (existingScript) {
            console.log('Script already exists in iframe, skipping injection');
            return;
        }
        const script = iframeDoc.createElement('script');
        script.id = 'cantoo-web-extension';
        if (currentScriptSrc) {
            const path = new URL(currentScriptSrc, document.baseURI).href;
            script.src = path;
        }
        else {
            script.textContent = (currentScriptTag === null || currentScriptTag === void 0 ? void 0 : currentScriptTag.textContent) || '';
        }
        iframeDoc.head.appendChild(script);
        injectedIframes.add(iframe);
        setupIframeObserver(iframe, iframeDoc);
    };
    const waitForH5pContent = (iframe, iframeDoc) => {
        const checkH5pClass = () => {
            try {
                if (iframeDoc.documentElement &&
                    iframeDoc.documentElement.classList.contains('h5p-iframe')) {
                    addScriptTagToIframe(iframe);
                }
                else {
                    console.log('Still waiting for h5p-iframe class in content document...');
                    // Continue checking
                    setTimeout(checkH5pClass, 100);
                }
            }
            catch (e) {
                console.debug('Error checking h5p-iframe class: ', e);
                // Continue checking even if there's an error
                setTimeout(checkH5pClass, 100);
            }
        };
        // Start checking immediately
        checkH5pClass();
    };
    const waitForStorylineToLoad = (iframe) => {
        let timeout = 0;
        const checkStorylineLoaded = () => {
            var _a;
            const shouldLoad = timeout >= 5000;
            try {
                if ((iframe.contentWindow &&
                    ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.API)) ||
                    shouldLoad) {
                    addScriptTagToIframe(iframe);
                }
                else {
                    // Continue checking
                    if (!shouldLoad) {
                        timeout += 100;
                        setTimeout(checkStorylineLoaded, 100);
                    }
                }
            }
            catch (e) {
                console.debug('Error checking storyline loaded: ', e);
                // Continue checking even if there's an error
                if (!shouldLoad) {
                    timeout += 100;
                    setTimeout(checkStorylineLoaded, 100);
                }
            }
        };
        checkStorylineLoaded();
    };
    const injectScriptToIframe = (iframe) => {
        var _a;
        const handleLoad = () => {
            var _a, _b, _c, _d;
            try {
                const iframeDoc = iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
                if (iframeDoc && ['complete', 'interactive'].includes(iframeDoc.readyState)) {
                    // Check if script is already injected
                    const existingScript = iframeDoc.querySelector('#cantoo-web-extension');
                    if (existingScript) {
                        console.log('Script already exists in iframe, skipping injection');
                        return;
                    }
                    // Check if this is an h5p-iframe and wait for the content document to have h5p-iframe class
                    if (iframe.classList.contains('h5p-iframe') ||
                        ((_d = (_c = (_b = iframe.parentElement) === null || _b === void 0 ? void 0 : _b.classList) === null || _c === void 0 ? void 0 : _c.contains) === null || _d === void 0 ? void 0 : _d.call(_c, 'h5p-iframe-wrapper'))) {
                        console.log('Detected h5p-iframe, waiting for content document to have h5p-iframe class...');
                        waitForH5pContent(iframe, iframeDoc);
                        return;
                    }
                    // If it's a storyline iframe, we wait for the storyline to be loaded
                    if (iframe.classList.contains('blocks-storyline__item__iframe')) {
                        waitForStorylineToLoad(iframe);
                        return;
                    }
                    addScriptTagToIframe(iframe);
                }
                else {
                    console.log('Cannot access document of iframe', iframe);
                }
            }
            catch (e) {
                console.debug('Cannot access iframe: ', iframe, e);
            }
        };
        // Inject immediately if already loaded
        try {
            const iframeDoc = iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
            if (iframeDoc && ['complete', 'interactive'].includes(iframeDoc.readyState)) {
                handleLoad();
                return;
            }
        }
        catch (e) {
            // Ignore, fallback to event
        }
        // Otherwise, wait for load
        iframe.addEventListener('load', handleLoad, { once: true });
    };
    const setupIframeObserver = (iframe, iframeDoc) => {
        // Clean up existing observer if any
        const existingObserver = iframeObservers.get(iframe);
        if (existingObserver) {
            existingObserver.disconnect();
        }
        const observer = new MutationObserver(mutations => {
            let needsReinjection = false;
            mutations.forEach(mutation => {
                // Check for documentElement replacement
                if (mutation.type === 'childList' && mutation.target === iframeDoc) {
                    mutation.removedNodes.forEach(node => {
                        if (node === iframeDoc.documentElement) {
                            console.log('DocumentElement replaced in iframe, will re-inject script');
                            needsReinjection = true;
                        }
                    });
                }
                // Check for head element replacement
                if (mutation.type === 'childList' &&
                    mutation.target === iframeDoc.documentElement) {
                    mutation.removedNodes.forEach(node => {
                        if (node === iframeDoc.head) {
                            console.log('Head element replaced in iframe, will re-inject script');
                            needsReinjection = true;
                        }
                    });
                }
                // Check for script element removal
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach(node => {
                        if (node instanceof HTMLElement && node.id === 'cantoo-web-extension') {
                            console.log('Cantoo script removed from iframe, will re-inject');
                            needsReinjection = true;
                        }
                    });
                }
            });
            if (needsReinjection) {
                // Remove from injected set and re-inject
                injectedIframes.delete(iframe);
                reinjectScriptWithRetry(iframe, 0);
            }
        });
        // Observe the iframe document for critical element changes
        try {
            observer.observe(iframeDoc, {
                childList: true,
                subtree: true,
            });
            // Also observe the documentElement specifically
            if (iframeDoc.documentElement) {
                observer.observe(iframeDoc.documentElement, {
                    childList: true,
                });
            }
            iframeObservers.set(iframe, observer);
        }
        catch (e) {
            console.debug('Failed to set up iframe observer: ', e);
        }
    };
    const reinjectScriptWithRetry = (iframe, retryCount = 0) => {
        const maxRetries = 3;
        const retryDelay = Math.min(100 * Math.pow(2, retryCount), 1000); // Exponential backoff, max 1s
        setTimeout(() => {
            var _a;
            try {
                const currentDoc = iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
                if (!currentDoc) {
                    console.debug('Cannot access iframe document for re-injection');
                    if (retryCount < maxRetries) {
                        reinjectScriptWithRetry(iframe, retryCount + 1);
                    }
                    return;
                }
                if (!['complete', 'interactive'].includes(currentDoc.readyState)) {
                    console.debug('Iframe document not ready for re-injection, retrying...');
                    if (retryCount < maxRetries) {
                        reinjectScriptWithRetry(iframe, retryCount + 1);
                    }
                    return;
                }
                // Check if script already exists (might have been re-added by another process)
                const existingScript = currentDoc.querySelector('#cantoo-web-extension');
                if (existingScript) {
                    console.log('Script already exists in iframe, skipping re-injection');
                    injectedIframes.add(iframe);
                    return;
                }
                // Ensure head element exists
                if (!currentDoc.head) {
                    console.debug('No head element found in iframe, creating one');
                    const htmlElement = currentDoc.documentElement || currentDoc.createElement('html');
                    const headElement = currentDoc.createElement('head');
                    htmlElement.insertBefore(headElement, htmlElement.firstChild);
                }
                const script = currentDoc.createElement('script');
                script.id = 'cantoo-web-extension';
                if (currentScriptSrc)
                    script.src = currentScriptSrc;
                else {
                    script.textContent = (currentScriptTag === null || currentScriptTag === void 0 ? void 0 : currentScriptTag.textContent) || '';
                }
                currentDoc.head.appendChild(script);
                injectedIframes.add(iframe);
                console.log('Script re-injected into iframe after element replacement');
                // Re-setup observer for the new document structure
                setupIframeObserver(iframe, currentDoc);
            }
            catch (e) {
                console.debug(`Failed to re-inject script into iframe (attempt ${retryCount + 1}): `, e);
                if (retryCount < maxRetries) {
                    reinjectScriptWithRetry(iframe, retryCount + 1);
                }
                else {
                    console.error('Max retries reached for iframe script re-injection');
                }
            }
        }, retryDelay);
    };
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node instanceof HTMLIFrameElement) {
                    injectScriptToIframe(node);
                }
                else if (node instanceof HTMLElement) {
                    // Check if the added element contains iframes
                    const iframes = node.querySelectorAll('iframe');
                    iframes.forEach(iframe => {
                        injectScriptToIframe(iframe);
                    });
                }
            });
        });
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
    // Handle existing iframes
    document.querySelectorAll('iframe').forEach(iframe => {
        injectScriptToIframe(iframe);
    });
    // Cleanup function to prevent memory leaks
    const cleanup = () => {
        iframeObservers.forEach((observer) => {
            observer.disconnect();
        });
        iframeObservers.clear();
        observer.disconnect();
    };
    // Clean up when the page is unloaded
    window.addEventListener('beforeunload', cleanup);
    // Also clean up if the iframe is removed from the DOM
    const iframeCleanupObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.removedNodes.forEach(node => {
                if (node instanceof HTMLIFrameElement) {
                    const iframeObserver = iframeObservers.get(node);
                    if (iframeObserver) {
                        iframeObserver.disconnect();
                        iframeObservers.delete(node);
                        injectedIframes.delete(node);
                    }
                }
            });
        });
    });
    iframeCleanupObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}

;// CONCATENATED MODULE: ./src/opensource/content.tsx

detectAndInjectIntoIframes();
function loadScript() {
    Promise.all(/* import() | app */[__webpack_require__.e("vendors"), __webpack_require__.e("app")]).then(__webpack_require__.bind(__webpack_require__, 237)).then(({ startOpensource }) => {
        startOpensource();
    });
}
if (document.readyState === 'loading') {
    window.addEventListener('load', loadScript);
}
else {
    loadScript();
}

/******/ })()
;