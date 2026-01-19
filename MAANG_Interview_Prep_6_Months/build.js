const fs = require('fs');
const path = require('path');

// Read all markdown files and embed them in HTML
function readAllMarkdownFiles() {
    const contentData = {};
    const baseDir = __dirname;
    
    // Read all months (1-6)
    for (let month = 1; month <= 6; month++) {
        contentData[month] = {};
        
        // Read all weeks (1-4)
        for (let week = 1; week <= 4; week++) {
            contentData[month][week] = {};
            
            // Read all categories
            const categories = ['Behavioral', 'DSA', 'System_Design', 'Revision'];
            
            categories.forEach(category => {
                const filePath = path.join(baseDir, `Month_${month}`, `Week_${week}`, `${category}.md`);
                
                try {
                    if (fs.existsSync(filePath)) {
                        const content = fs.readFileSync(filePath, 'utf8');
                        // Use JSON.stringify to properly escape all special characters
                        // This handles backticks, dollar signs, newlines, quotes, etc.
                        contentData[month][week][category] = content;
                    } else {
                        contentData[month][week][category] = `# ${category} - Week ${week}\n\nContent file not found.`;
                    }
                } catch (error) {
                    contentData[month][week][category] = `# ${category} - Week ${week}\n\nError reading file: ${error.message}`;
                }
            });
        }
    }
    
    return contentData;
}

// Read the HTML template
function readHTMLTemplate() {
    const htmlPath = path.join(__dirname, 'index.html');
    return fs.readFileSync(htmlPath, 'utf8');
}

// Embed content data into HTML
function embedContentInHTML(html, contentData) {
    // Remove any existing embeddedContent script
    const embeddedContentRegex = /<script>\s*\/\/ Embedded markdown content\s*const embeddedContent = [\s\S]*?<\/script>/g;
    html = html.replace(embeddedContentRegex, '');
    
    // Convert contentData to JSON string, then embed it
    const contentScript = `
        <script>
            // Embedded markdown content
            const embeddedContent = ${JSON.stringify(contentData, null, 2)};
        </script>
    `;
    
    // Insert before the closing </body> tag
    html = html.replace('</body>', contentScript + '\n    </body>');
    
    // Update the loadContent function to use embedded content
    const newLoadContent = `
        // Content loading and display
        async function loadContent(node, categoryElement) {
            const contentViewer = document.getElementById('contentViewer');
            const contentBody = document.getElementById('contentBody');
            const contentTitle = document.getElementById('contentTitle');
            const overlay = document.getElementById('overlay');
            
            // Update title
            contentTitle.textContent = \`Month \${node.month} - Week \${node.week} - \${node.category}\`;
            
            // Show loading
            contentBody.innerHTML = '<div class="loading">Loading content...</div>';
            
            // Open viewer
            contentViewer.classList.add('open');
            overlay.classList.add('active');
            
            // Remove active class from all categories
            document.querySelectorAll('.tree-node.category').forEach(cat => {
                cat.classList.remove('active');
            });
            
            // Add active class to clicked category
            if (categoryElement) {
                categoryElement.classList.add('active');
            }
            
            try {
                // Get content from embedded data
                const markdown = embeddedContent[node.month]?.[node.week]?.[node.category];
                
                if (!markdown) {
                    throw new Error('Content not found');
                }
                
                // Configure marked options
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: true,
                    mangle: false
                });
                
                // Convert markdown to HTML
                const html = marked.parse(markdown);
                contentBody.innerHTML = html;
            } catch (error) {
                contentBody.innerHTML = \`
                    <div style="text-align: center; padding: 40px; color: #e74c3c;">
                        <h2>⚠️ Error Loading Content</h2>
                        <p>Could not load the markdown content for: Month \${node.month} - Week \${node.week} - \${node.category}</p>
                        <p style="margin-top: 20px; color: #666;">\${error.message}</p>
                    </div>
                \`;
            }
        }
    `;
    
    // Replace the old loadContent function - find the function and replace everything until the next function or closing script tag
    const loadContentStart = html.indexOf('// Content loading and display');
    if (loadContentStart !== -1) {
        // Find the end of the loadContent function (next function or closing script tag)
        const afterStart = html.substring(loadContentStart);
        const functionEnd = afterStart.indexOf('\n        }\n\n        // Close content viewer');
        if (functionEnd !== -1) {
            const before = html.substring(0, loadContentStart);
            const after = html.substring(loadContentStart + functionEnd + 1);
            html = before + newLoadContent + after;
        }
    }
    
    return html;
}

// Main function
function build() {
    console.log('Reading markdown files...');
    const contentData = readAllMarkdownFiles();
    
    console.log('Reading HTML template...');
    let html = readHTMLTemplate();
    
    console.log('Embedding content in HTML...');
    html = embedContentInHTML(html, contentData);
    
    console.log('Writing output file...');
    const outputPath = path.join(__dirname, 'index.html');
    fs.writeFileSync(outputPath, html, 'utf8');
    
    console.log('✅ Build complete! Open index.html in your browser.');
    console.log(`   Embedded content for ${Object.keys(contentData).length} months`);
}

// Run the build
build();
