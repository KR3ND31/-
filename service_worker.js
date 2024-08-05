import Analytics from '../js/google-analytics.js';

chrome.runtime.onInstalled.addListener(() => {
    Analytics.fireEvent('install');
});