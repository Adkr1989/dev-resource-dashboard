/**
 * DevDash - A provider-agnostic developer resource dashboard.
 * Reads config.json to determine tabs, stat colors, and data sources.
 * Each tab renders categories of cards or tables from its data file.
 */
const Dashboard = (() => {
    let data = null;

    // ─── Rendering Helpers ───

    function renderCard(item) {
        const meta = (item.meta || []).map(m => `<span class="meta-tag">${m}</span>`).join('');
        const tools = (item.tools || []).map(t => `<span class="tool-tag">${t}</span>`).join('');
        const path = item.path ? `<div class="card-path">${escapeHtml(item.path)}</div>` : '';
        const link = item.url ? ` onclick="window.open('${escapeHtml(item.url)}','_blank')" style="cursor:pointer"` : '';
        return `
        <div class="resource-card"${link}>
            <div class="card-header">
                <span class="card-title">${escapeHtml(item.name || item.title || '')}</span>
                ${item.badge ? `<span class="card-badge ${item.badgeClass || 'badge-ready'}">${escapeHtml(item.badge)}</span>` : ''}
            </div>
            ${item.description ? `<p class="card-description">${escapeHtml(item.description)}</p>` : ''}
            ${meta ? `<div class="card-meta">${meta}</div>` : ''}
            ${tools ? `<div class="card-tools">${tools}</div>` : ''}
            ${path}
        </div>`;
    }

    function renderCardGrid(items) {
        return `<div class="card-grid">${items.map(renderCard).join('')}</div>`;
    }

    function renderTable(columns, rows) {
        const head = columns.map(c => `<th>${escapeHtml(c)}</th>`).join('');
        const body = rows.map(r => {
            const cells = columns.map(c => {
                const key = c.toLowerCase().replace(/\s+/g, '');
                // Try exact key, then lowercase, then first matching key
                const val = r[c] || r[key] || r[c.toLowerCase()] || Object.values(r).find((_, i) => Object.keys(r)[i].toLowerCase().replace(/\s+/g, '') === key) || '';
                return `<td>${escapeHtml(String(val))}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
    }

    function countItems(obj) {
        if (!obj || !obj.categories) return 0;
        return obj.categories.reduce((sum, cat) => sum + (cat.items ? cat.items.length : 0), 0);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ─── Stats Bar ───

    function renderStats() {
        const config = data.config;
        const colors = ['var(--accent-green)', 'var(--accent-blue)', 'var(--accent-purple)', 'var(--accent-pink)', 'var(--accent-gold)'];

        const cards = config.tabs
            .filter(tab => tab.showStat !== false && tab.dataFile)
            .map((tab, i) => {
                const tabData = data[tab.id];
                const count = tabData ? countItems(tabData) : 0;
                const color = tab.statColor || colors[i % colors.length];
                return `
                <div class="stat-card" data-tab="${tab.id}">
                    <div class="stat-number" style="color:${color}">${count}</div>
                    <div class="stat-label">${escapeHtml(tab.label)}</div>
                </div>`;
            }).join('');

        document.getElementById('stats').innerHTML = `<div class="stats-grid">${cards}</div>`;

        // Click stat card to switch tab
        document.querySelectorAll('.stat-card[data-tab]').forEach(card => {
            card.addEventListener('click', () => {
                const tabId = card.dataset.tab;
                const tabEl = document.querySelector(`.tab[data-tab="${tabId}"]`);
                if (tabEl) tabEl.click();
            });
        });
    }

    // ─── Generic Tab Renderer ───

    function renderTab(tabId) {
        const tabData = data[tabId];
        if (!tabData || !tabData.categories) return;

        const tabConfig = data.config.tabs.find(t => t.id === tabId);
        const total = countItems(tabData);
        let html = `
        <div class="section-header">
            <h2 class="section-title">${escapeHtml(tabConfig.label)}</h2>
            <span class="section-count">${total} total</span>
        </div>`;

        tabData.categories.forEach(cat => {
            const count = cat.items ? cat.items.length : 0;
            const label = cat.subtitle ? `${cat.name} (${cat.subtitle})` : `${cat.name} (${count})`;
            html += `<div class="category-section"><h3 class="category-title">${escapeHtml(label)}</h3>`;

            if (cat.display === 'table' && cat.columns) {
                html += renderTable(cat.columns, cat.items || []);
                if (cat.footer) html += `<div class="card-path" style="margin-top:1rem">${escapeHtml(cat.footer)}</div>`;
            } else {
                html += renderCardGrid(cat.items || []);
            }

            html += `</div>`;
        });

        // Render optional extra sections (quickReference, credentials, revenue, etc.)
        for (const [key, section] of Object.entries(tabData)) {
            if (key === 'categories') continue;
            if (section && section.columns && section.items) {
                html += `
                <div class="category-section">
                    <h3 class="category-title">${escapeHtml(key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()))}</h3>
                    ${renderTable(section.columns, section.items)}
                </div>`;
            }
        }

        return html;
    }

    // ─── Tab System ───

    function buildTabs() {
        const config = data.config;
        const tabBar = document.getElementById('tabBar');
        const panels = document.getElementById('tabPanels');

        config.tabs.forEach((tab, i) => {
            // Tab button
            const btn = document.createElement('div');
            btn.className = `tab${i === 0 ? ' active' : ''}`;
            btn.dataset.tab = tab.id;
            btn.textContent = tab.label;
            tabBar.appendChild(btn);

            // Tab panel
            const panel = document.createElement('div');
            panel.className = `tab-content${i === 0 ? ' active' : ''}`;
            panel.id = tab.id;
            panels.appendChild(panel);
        });

        // Render all tab content
        config.tabs.forEach(tab => {
            const panel = document.getElementById(tab.id);
            if (tab.dataFile && data[tab.id]) {
                panel.innerHTML = renderTab(tab.id);
            }
        });

        // Tab click handlers
        tabBar.querySelectorAll('.tab').forEach(btn => {
            btn.addEventListener('click', () => {
                tabBar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                panels.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }

    // ─── Search ───

    function initSearch() {
        document.getElementById('searchBox').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.resource-card').forEach(card => {
                card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
            document.querySelectorAll('tbody tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    // ─── Export ───

    function initExport() {
        document.getElementById('exportBtn').addEventListener('click', () => {
            const exported = {};
            data.config.tabs.forEach(tab => {
                if (data[tab.id]) exported[tab.id] = data[tab.id];
            });
            const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `devdash-export-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // ─── Init ───

    async function init() {
        try {
            data = await DataLoader.loadAll();
            const config = data.config;

            document.title = config.title || 'DevDash';
            document.getElementById('dashTitle').textContent = config.title || 'DevDash';
            document.getElementById('dashSubtitle').textContent = config.subtitle || '';
            document.getElementById('footerText').textContent = `${config.title || 'DevDash'} - Updated ${config.lastUpdated || 'today'}`;

            renderStats();
            buildTabs();
            initSearch();
            initExport();
        } catch (err) {
            document.querySelector('.container').innerHTML = `
            <div style="text-align:center;padding:4rem;color:var(--accent-red)">
                <h2>Failed to load dashboard data</h2>
                <p style="margin-top:1rem;color:var(--text-secondary)">${err.message}</p>
                <p style="margin-top:0.5rem;color:var(--text-secondary)">Make sure you're running via a local server: <code>npx serve</code> or <code>python -m http.server</code></p>
            </div>`;
        }
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', Dashboard.init);
