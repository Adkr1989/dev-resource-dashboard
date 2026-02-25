/**
 * DataLoader - Fetches and caches JSON data files.
 * Loads all configured data sources defined in config.json.
 */
const DataLoader = (() => {
    const cache = {};

    async function load(file) {
        if (cache[file]) return cache[file];
        const res = await fetch(`data/${file}`);
        if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
        cache[file] = await res.json();
        return cache[file];
    }

    async function loadAll() {
        const config = await load('config.json');
        const result = { config };

        // Load each tab's data file
        for (const tab of config.tabs) {
            if (tab.dataFile) {
                result[tab.id] = await load(tab.dataFile);
            }
        }

        return result;
    }

    function invalidate(file) {
        if (file) delete cache[file];
        else Object.keys(cache).forEach(k => delete cache[k]);
    }

    return { load, loadAll, invalidate };
})();
