function setDefauldValues() {
    document.querySelector('.battle-count').value = 100;
    document.querySelector('.battle-range').value = 100;
    const radioByttonsNodes = document.querySelectorAll('.configuration-container input');
    const radioByttons = [...radioByttonsNodes];
    radioByttons.forEach(node => {
        if (node.value === "basic") {
            node.checked = true;
        } else {
            node.checked = false;
        }
    });
}

const showWidget = (event) => {
    const targetTank = event.target.closest('.tank');
    if (targetTank) {
        setDefauldValues();
        const battles = document.querySelector('.battle-count').value;
        updateExperience(battles);
        fillRangeWithColor();
        
        const tankDOMRect = targetTank.getBoundingClientRect();
        const contentDOMRect = document.querySelector('.content').getBoundingClientRect();
        const widget = document.querySelector('.widget');

        widget.style.left = window.screen.width > 600 ? `${contentDOMRect.width - contentDOMRect.right + tankDOMRect.left}px` : 0;
        widget.style.top = `${contentDOMRect.height - contentDOMRect.bottom + tankDOMRect.bottom + 30}px`;
        widget.style.display = 'grid';
    }
}

document.querySelector('.content').addEventListener('mouseover', showWidget);

function fillRangeWithColor() {
    const battleRange = document.querySelector('.battle-range');
    const progress = (battleRange.value / battleRange.max) * 100;

    battleRange.style.background = `linear-gradient(to right, #FFD100 ${progress}%, #1D1D1F ${progress}%)`;
}

function calculateExperience(battles, checkedConfiguration) {
    let count;

    switch (checkedConfiguration) {
        case 'basic':
            count = battles * 3;
            break;
        case 'elite':
            count = battles * 1.1 * 3;
            break;
        case 'premium':
            count = battles * 1.2 * 3;
            break;
        default:
            count = 0;
    }

    return Math.round(count);
}

function updateExperience(battles) {
    document.querySelector('.warning').style.display = "none";
    const checkedConfiguration = document.querySelector('.configuration-container input:checked').value;
    const experience = calculateExperience(Number(battles), checkedConfiguration);

    document.querySelector('.tank-experience-count').textContent = experience;
}

function getIsValidBattleCount(value) {
    const regexp = /^0$|^[1-9][0-9]?$|^[1-2][0-9][0-9]$|^300$/;

    return value === '' || regexp.test(value);
}

document.querySelector('.configuration-container').addEventListener('change', () => {
    const battles = document.querySelector('.battle-count').value;
    const isValidBattleCount = getIsValidBattleCount(battles);

    if (isValidBattleCount) {
        updateExperience(battles);
    } else {
        document.querySelector('.warning').style.display = "block";
    }
});

document.querySelector('.battle-range').addEventListener('input', () => {
    const battleRange = document.querySelector('.battle-range');
    const battleCount = document.querySelector('.battle-count');

    battleCount.value = battleRange.value;
    updateExperience(battleRange.value);
    fillRangeWithColor();
});

document.querySelector('.battle-count').addEventListener('input', () => {
    const battleRange = document.querySelector('.battle-range');
    const battleCount = document.querySelector('.battle-count');

    const isValidBattleCount = getIsValidBattleCount(battleCount.value);
    if (isValidBattleCount) {
        battleRange.value = Number(battleCount.value);
        updateExperience(battleCount.value);
        fillRangeWithColor();
    } else {
        document.querySelector('.warning').style.display = "block";
    }
});

document.addEventListener('click', event => {
    const tankContainer = event.target.closest('.tank-container');
    const widget = event.target.closest('.widget');

    if (tankContainer === null && widget === null) {
        document.querySelector('.widget').style.display = 'none';
    }
})
