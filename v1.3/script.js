var inputDiv = document.getElementById("input");
var loadingDiv = document.getElementById("loading");
var resultDiv = document.getElementById("result");
var fracMode = "decimal";
var targetList = [];
var errorList = [];
var resultList = [];
var lastTargetInput;
var lastAccInput;
var lastSpan;
var lastTh;
var lastTh2;
var inputTableElement = document.getElementById("inputTableBody");
var resultTableElement = document.getElementById("resultTableBody");
function arraysEqualCheck(arr1, arr2) {
  var allEqual;
  if (arr1.length === arr2.length) {
    allEqual = true;
    for (a = 0; a < arr1.length; a++) {
      if (Array.isArray(arr1[a]) && Array.isArray(arr2[a])) {
        allEqual = arraysEqualCheck(arr1[a], arr2[a]) && allEqual;
      } else {
        allEqual = arr1[a] === arr2[a] && allEqual;
      }
    }
  } else {
    allEqual = false;
  }
  return allEqual;
}
function inputPhase() {
  resultDiv.style.display = "none";
  while (targetList.length != 0) {
    deleteInput();
    resultTableElement.lastChild.remove();
  }
  inputDiv.style.display = "block";
}
function loadingPhase() {
  inputDiv.style.display = "none";
  loadingDiv.style.display = "block";
  setTimeout(function() {
    targetRPM(targetList, errorList);
  }, 100);
}
function resultPhase() {
  loadingDiv.style.display = "none";
  resultDiv.style.display = "block";
}
function fracSwitch() {
  if (fracMode === "decimal") {
    fracMode = "frac";
    document.getElementById("targetInput2").style.display = "inline-block";
    document.getElementById("targetInput").placeholder = "Numerator";
  } else {
    fracMode = "decimal";
    document.getElementById("targetInput2").style.display = "none";
    document.getElementById("targetInput").placeholder = "Any number > 0";
  }
}
function addRatio() {
  lastTargetInput = -1;
  if (fracMode === "decimal") {
    lastTargetInput = parseFloat(document.getElementById("targetInput").value);
  } else {
    let num = parseFloat(document.getElementById("targetInput").value);
    let den = parseFloat(document.getElementById("targetInput2").value);
    if (num != NaN && den != NaN && den !== 0) {
      lastTargetInput = num / den;
    }
  }
  if (lastTargetInput > 0) {
    lastAccInput = document.getElementById("inputAccuracy").value;
    if (targetList.some(num => num === lastTargetInput)) {
      let i = 0;
      while (targetList[i] !== lastTargetInput) {
        i++;
      }
      errorList[i] = lastAccInput;
      var oldTh = document.getElementById("inputLine" + (i + 1)).lastChild;
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(lastAccInput  + "%"));
      oldTh.replaceWith(lastTh);
    } else {
      targetList.push(lastTargetInput);
      errorList.push(lastAccInput);
      var lastTr = document.createElement("tr");
      lastTr.id = "inputLine" + targetList.length;
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(lastTargetInput));
      lastTr.appendChild(lastTh);
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(lastAccInput + "%"));
      lastTr.appendChild(lastTh);
      inputTableElement.appendChild(lastTr);
      inputTableElement.style.display = "block";
      document.getElementById("selButtons").style.display = "block";
    }
  }
}
function deleteInput() {
  targetList.pop();
  errorList.pop();
  if (targetList.length === 0) {
    inputTableElement.style.display = "none";
    document.getElementById("selButtons").style.display = "none";
  }
  inputTableElement.lastChild.remove();
}
function looprs(nbacg, minerror, maxerror, F, sol, L = [], indexrs = 0) {
  if (L.length === nbacg) {
    let num = 1;
    let den = 1;
    for (let b = 0; b < nbacg; b++) {
      if (L[b] < 0) {
        num *= 16;
        den *= 17 - L[b];
      } else {
        num *= 17 + L[b];
        den *= 16;
      }
    }
    const c = num / den;
    for (let a = 0; a < minerror.length; a++) {
      for (let b = 0; b < minerror[a].length; b++) {
        if (c > minerror[a][b] && c < maxerror[a][b]) {
          sol[a] = sol[a].concat([[L, c * Math.pow(2, F[a][b]), F[a][b]]]);
        }
      }
    }
  } else {
    const rs = [[-14], [-13], [-12], [-11], [-10], [-9], [-8], [-7], [-6], [-5], [-4], [-3], [-2], [-1], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14]];
    for (let a = indexrs; a < 28; a++) {
      sol = looprs(nbacg, minerror, maxerror, F, sol, L.concat(rs[a]), a);
    }
  }
  return sol;
}
function targetRPM(targets, errors) {
  let targets2 = [];
  for (let a of targets) {
    let F = [];
    let fact = 0;
    while (a >= 2) {
      F.push([a, fact]);
      a = a / 2;
      fact++;
    }
    while (a <= 0.5) {
      F.push([a, fact]);
      a *= 2;
      fact--;
    }
    F.push([a, fact]);
    if (fact >= 0) {
      F.push([a / 2, fact + 1]);
      F.push([a / 4, fact + 2]);
    }
    if (fact <= 0) {
      F.push([a * 2, fact - 1]);
      F.push([a * 4, fact - 2]);
    }
    targets2.push(F);
  }
  let L = Array(targets.length).fill([]);
  let F = Array(targets.length).fill([]);
  let a = 0;
  let minerror = Array(targets.length).fill([]);
  let maxerror = Array(targets.length).fill([]);
  for (let b = 0; b < targets.length; b++) {
    for (let c = 0; c < targets2[b].length; c++) {
      minerror[b] = minerror[b].concat([targets2[b][c][0] * (1 - errors[b] / 100)]);
      maxerror[b] = maxerror[b].concat([targets2[b][c][0] * (1 + errors[b] / 100)]);
      F[b] = F[b].concat([targets2[b][c][1]]);
      if (resultList.some(r => r[0] > minerror[b][c] && r[0] < maxerror[b][c])) {
        for (let r of resultList) {
          if (r[0] > minerror[b][c] && r[0] < maxerror[b][c]) {
            for (let d = 0; d < r[1].length; d++) {
              L[b] = L[b].concat([[r[1][d][0], r[0], r[1][d][1] + F[b][c]]]);
            }
          }
        }
      }
    }
  }
  while (L.some(arr => arr.length === 0)) {
    L = looprs(a, minerror, maxerror, F, L, [], 0);
    a++;
  }
  for (let b = 0; b < targets.length; b++) {
    let closest = L[b][0][1];
    for (let a of L[b]) {
      if (Math.abs(a[1] - targets[b]) < Math.abs(closest - targets[b])) {
        closest = a[1];
      }
    }
    let V = [];
    for (let a of L[b]) {
      if (a[1] === closest && !(V.some(el => arraysEqualCheck(el, [a[0], a[2]])))) {
        V.push([a[0], a[2]]);
      }
    }
    const score = elV => 2 * elV[0].length + Math.abs(elV[1]);
    let best = score(V[0]);
    for (let a of V) {
      if (score(a) < best) {
        best = score(a);
      }
    }
    let i = 0;
    let noMatch = true;
    while (i < resultList.length && noMatch) {
      noMatch = (resultList[i][0] !== closest);
      i++;
    }
    if (noMatch) {
      resultList.push([closest, []]);
    } else {
      i--;
    }
    var lastTr = document.createElement("tr");
    lastTr.id = "resultLine" + (b+1);
    lastTh = document.createElement("th");
    lastTh.appendChild(document.createTextNode(targetList[b]));
    lastTr.appendChild(lastTh);
    lastTh = document.createElement("th");
    lastTh2 = document.createElement("th");
    for (let a of V) {
      if (score(a) === best) {
        if (!resultList[i][1].some(c => arraysEqualCheck(c, a))) {
          resultList[i][1].push(a);
        }
        var lastDiv = document.createElement("div");
        for (let c of a[0]) {
          lastSpan = document.createElement("span");
          if (c < 0) {
            lastSpan.setAttribute("class","ACGNeg");
            lastSpan.appendChild(document.createTextNode(-c));
          } else {
            lastSpan.setAttribute("class","ACGPos");
            lastSpan.appendChild(document.createTextNode(c));
          }
          lastDiv.appendChild(lastSpan);
        }
        lastTh.appendChild(lastDiv);
        var lastDiv2 = document.createElement("div");
        if (a[1] > 0) {
          lastDiv2.setAttribute("class","doublePos");
          lastDiv2.appendChild(document.createTextNode(a[1]));
        } else if (a[1] < 0) {
          lastDiv2.setAttribute("class","doubleNeg");
          lastDiv2.appendChild(document.createTextNode(-a[1]));
        } else {
          lastDiv2.setAttribute("class","double0");
          lastDiv2.appendChild(document.createTextNode(0));
        }
        lastTh2.appendChild(lastDiv2);
      }
    }
    lastTr.appendChild(lastTh);
    lastTr.appendChild(lastTh2);
    lastTh = document.createElement("th");
    lastTh.appendChild(document.createTextNode(closest));
    lastTr.appendChild(lastTh);
    resultTableElement.appendChild(lastTr);
  }
  resultPhase();
}
document.body.onload = inputPhase();