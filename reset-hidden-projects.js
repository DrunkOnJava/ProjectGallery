// Script to reset hidden projects to the correct list
const correctHiddenProjects = [
    'silly-lily-66b5e2',
    'preeminent-hotteok-79f13e',
    'magical-bubblegum-faf4ee',
    'steady-phoenix-93bfd1',
    'brokenfileflattener',
    'sweet-nougat-1df434',
    'ephemeral-alfajores-3f1147',
    'tiny-youtiao-dd447a',
    'adorable-empanada-10d2a4',
    'melodious-bienenstitch',
    'stately-kelpie-a559bb',
    'rococo-starburst-882bb6',
    'bucolic-griffin-9cf2cb',
    'scintillating-youtiao',
    'melodious-melba-4d2edd',
    'resonant-baklava-be6eb1',
    'benevolent-flan-f2c21d',
    'famous-dragon-b0cae6',
    'jolly-mooncake-7d55df',
    'friendly-daifuku-78fd5b',
    'bejewelled-kataifi-88b1d9',
    'coruscating-cat-3a8117'
];

console.log('Setting correct hidden projects list...');
console.log('Copy and paste this into your browser console when viewing the gallery:');
console.log('');
console.log(`localStorage.setItem('hiddenProjects', '${JSON.stringify(correctHiddenProjects)}');`);
console.log('location.reload();');