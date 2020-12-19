
const STRModA = 1600;
const STRModB = 1700;
const STRModC = 700;
const SPDModA = 1600;
const SPDModB = 2000;
const SPDModC = 1350;
const DEFModA = 2100;
const DEFModB = -600;
const DEFModC = 1500;
const DEXModA = 1800;
const DEXModB = 1500;
const DEXModC = 1000;
const mods = {
    'strength': [STRModA, STRModB, STRModC],
    'speed': [SPDModA, SPDModB, SPDModC],
    'defense': [DEFModA, DEFModB, DEFModC],
    'dexterity': [DEXModA, DEXModB, DEXModC],
};

const MaxHappy = 99999;
const RegularHappy = 4950;

// ROUND(数值, 小数位数)
function excelRound(number, dots) {
    var scale = Math.pow(10, dots);
    return Math.round(number * scale) / scale;
}

function train(energy, stat, happy, gym, perks, attributeName) {
    if (typeof attributeName === 'undefined' || !Object.keys(mods).includes(attributeName)) {
        console.error('invalid attributeName')
        return -1;
    }
    var [modA, modB, modC] = mods[attributeName];
    var capedStat = stat > 50000000 ? 50000000 : stat;
    var gain = (capedStat * excelRound(1 + 0.07 * excelRound(Math.log(1 + happy / 250), 4), 4) + 8 * Math.pow(happy, 1.05) + (1 - Math.pow((happy / 99999), 2)) * modA + modB) * (1 / 200000) * gym * energy * perks;
    var upperGain = (capedStat * excelRound(1 + 0.07 * excelRound(Math.log(1 + happy / 250), 4), 4) + 8 * Math.pow(happy, 1.05) + (1 - Math.pow((happy / 99999), 2)) * modA + modB + modC) * (1 / 200000) * gym * energy * perks;
    var lowerGain = (capedStat * excelRound(1 + 0.07 * excelRound(Math.log(1 + happy / 250), 4), 4) + 8 * Math.pow(happy, 1.05) + (1 - Math.pow((happy / 99999), 2)) * modA + modB - modC) * (1 / 200000) * gym * energy * perks;
    // console.log(`${gain} (${lowerGain} ~ ${upperGain})`);
    return gain;
}

function doTrains(energy, energyPerTrain, stat, happy, gym, perks, attributeName) {
    let times = Math.floor(energy / energyPerTrain);
    let finalStat = stat;
    for (let i = 0; i < times; i++) {
        let gain = train(energyPerTrain, finalStat, happy, gym, perks, attributeName);
        if (gain == -1) {
          return;
        }
        finalStat += gain;
    }
    console.log(`start: ${stat}`);
    console.log(`energy: ${times * energyPerTrain}`);
    console.log(`final: ${finalStat}`);
    return finalStat;
}

function doTrains2(expectedStat, energyPerTrain, stat, happy, gym, perks, attributeName) {
    let times = 0;
    while (stat < expectedStat) {
        let gain = train(energyPerTrain, stat, happy, gym, perks, attributeName);
        if (gain == -1) {
          return;
        }
        stat += gain;
        times++;
    }
    let spentEnergy = times * energyPerTrain;
    console.log(spentEnergy);
    return spentEnergy;
}

function bookGains(energyPerTrain, stat, gym, perks, attributeName, days) {
    days = days || 30;
    const energy = days * 1620;
    let finalStat = doTrains(energy, energyPerTrain, stat, MaxHappy, gym, perks, attributeName);
    let regularEnergy = doTrains2(finalStat, energyPerTrain, stat, RegularHappy, gym, perks, attributeName);
    let savedEnergy = regularEnergy - energy;
    let efficiency = regularEnergy / energy;
    console.log(`finalStat: ${finalStat}`);
    console.log(`savedEnergy: ${savedEnergy}`);
    console.log(`efficiency: ${(efficiency * 100).toFixed(2)}%`);
}

module.exports = {
  excelRound,
  doTrains,
  doTrains2,
};

// 方案1：解锁george的同时满足比例
function planA() {
  // 1. spd与str相同
  doTrains2(1452008, 25, 410092, RegularHappy, 7.5, 1.09 * 1.02 * 1.01, 'spd');
  // 23125
  doTrains(23125, 25, 410092, RegularHappy, 7.5, 1.09 * 1.02 * 1.01, 'spd');
  // 1453872.4535171448

  // 2. str与spd 1:1
  const totalEnergy = (56520 + 67775 + 84535 + 106305) / 1.3 - 23125;
  let energyForSTR = 67600;
  let finalSTR = doTrains(energyForSTR, 25, 1452008, RegularHappy, 7.5, 1.10 * 1.02 * 1.01, 'str');
  let energyForSPD = doTrains2(finalSTR, 25, 1453872, RegularHappy, 7.5, 1.09 * 1.02 * 1.01, 'spd');
  let finalSPD = doTrains(energyForSPD, 25, 1453872, RegularHappy, 7.5, 1.09 * 1.02 * 1.01, 'spd');

  // 3. 在Last Round(7.0)健身房补def
  let energyForDEF = totalEnergy - energyForSTR - energyForSPD;
  let finalDEF = doTrains(energyForDEF, 10, 1128545, RegularHappy, 7.0, 1.09 * 1.02 * 1.01, 'def');
  console.log(`${finalSTR} ${finalDEF * 0.8}`);
  console.log(`wasted: ${(8.0 - 7.0) / 8.0 * energyForDEF}`);
  // 10435.817307692305 (would be 19526.25 without Music Store)
}

// 方案2：解锁George's后再补def
function planB() {
  // 1. spd与str相同
  doTrains2(1452008, 25, 410092, RegularHappy, 7.5, 1.09 * 1.02 * 1.01, 'spd');
  // 23125
  doTrains(23125, 25, 410092, RegularHappy, 7.5, 1.09 * 1.02 * 1.01, 'spd');
  // 1453872.4535171448

  // 2. str与spd 1:1
  const totalEnergy = (56520 + 67775 + 84535 + 106305) / 1.3 - 23125;
  let finalSTR = doTrains(totalEnergy / 2, 25, 1452008, RegularHappy, 7.5, 1.10 * 1.02 * 1.01, 'str');
  let finalSPD = doTrains(totalEnergy / 2, 25, 1453872, RegularHappy, 7.5, 1.09 * 1.02 * 1.01, 'spd');

  // 3. 在George's(7.3)健身房补def
  let energyForDEF = doTrains2(finalSTR * 1.25, 10, 1128545, RegularHappy, 7.3, 1.09 * 1.02 * 1.01, 'def');
  let finalDEF = doTrains(energyForDEF, 10, 1128545, RegularHappy, 7.3, 1.09 * 1.02 * 1.01, 'def');
  console.log(`wasted: ${(8.0 - 7.3) / 8.0 * energyForDEF}`);
  // 11754.750000000004
}


