const fs = require('fs');
const path = 'c:/Users/koala/OneDrive/Desktop/Embervale/constants/repeatableQuests.ts';
let content = fs.readFileSync(path, 'utf8');
let i = 1;
const newContent = content.replace(/\{ id: '([^']+)'/g, (match, id) => {
    return `{ id: '${id}', questNum: ${i++}`;
});
fs.writeFileSync(path, newContent);
console.log(`Successfully assigned questNum to ${i - 1} repeatable quests.`);
