var inputDiv = document.getElementById("input");
var loadingDiv = document.getElementById("loading");
var resultDiv = document.getElementById("result");
var libraryDiv = document.getElementById("assetLibrary");
var targetList = [];
var targetRatios = [];
var settingsList = [];
var resultList = [];
var currentSettings = [0.01, true, true, true, true, true];
var addRatioIdle = true;
var delIdle = true;
var setFocusIdle = true;
var focused = "none";
var inputError;
var lastSpan;
var lastTh;
var lastTh2;
var inputBoxElement = document.getElementById("targetInput");
var inputTableElement = document.getElementById("inputTableBody");
var resultTableElement = document.getElementById("resultTableBody");
var gridListElement = document.getElementById("gridList");
const infoLength = document.getElementById("infoInput").childElementCount;
const rs = [-14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
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
  document.getElementById("loadingError").style.display = "none";
  gridListElement.replaceChildren();
  resultDiv.classList.replace("setupDispON", "setupDispOFF");
  while (targetList.length !== 0) {
    delInputIndex(0);
    resultTableElement.lastChild.remove();
  }
  focused = "none";
  let f = document.getElementsByClassName("focusTarget");
  if (f.length > 0) {
    f[0].setAttribute("class", "inputCol1");
  }
  for (let a of document.getElementById("infoInput").children) {
    a.style.display = "none";
  }
  if (resultList.length !== 0) {
    let lastTr, lastDiv;
    let l = document.getElementById("infoInput").children;
    if (l[l.length - 1].lastChild.nodeName !== "HR") {
      for (let a of l) {
        a.appendChild(document.createElement("hr"));
      }
    }
    document.getElementById("inputBottomLeft").children[0].style.display = "block";
    document.getElementById("historyDiv").style.display = "block";
    for (let i = 0; i < resultList.length; i++) {
      lastTr = document.createElement("tr");
      lastTr.id = "historyLine" + (i + 1);
      lastTh = document.createElement("th");
      lastTh2 = document.createElement("th");
      for (let j = 0; j < resultList[i][1].length; j++) {
        lastDiv = document.createElement("div");
        for (let k of resultList[i][1][j][0]) {
          lastSpan = document.createElement("span");
          if (Array.isArray(k)) {
            lastSpan.appendChild(document.createElement("span"));
            lastSpan.appendChild(document.createElement("span"));
            lastSpan.setAttribute("class", "ACGMult");
            lastSpan.children[1].appendChild(document.createTextNode("x" + k[1]));
            if (k[0] < 0) {
              lastSpan.children[0].setAttribute("class", "ACGNeg");
              lastSpan.children[0].appendChild(document.createTextNode(-k[0]));
            } else {
              lastSpan.children[0].setAttribute("class", "ACGPos");
              lastSpan.children[0].appendChild(document.createTextNode(k[0]));
            }
          } else if (k < 0) {
            lastSpan.setAttribute("class", "ACGNeg");
            lastSpan.appendChild(document.createTextNode(-k));
          } else {
            lastSpan.setAttribute("class", "ACGPos");
            lastSpan.appendChild(document.createTextNode(k));
          }
          lastDiv.appendChild(lastSpan);
        }
        lastTh.appendChild(lastDiv);
        lastDiv = document.createElement("div");
        if (resultList[i][1][j][1] > 0) {
          lastDiv.setAttribute("class", "doublePos");
          lastDiv.appendChild(document.createTextNode(resultList[i][1][j][1]));
        } else if (resultList[i][1][j][1] < 0) {
          lastDiv.setAttribute("class", "doubleNeg");
          lastDiv.appendChild(document.createTextNode(-resultList[i][1][j][1]));
        } else {
          lastDiv.setAttribute("class", "double0");
          lastDiv.appendChild(document.createTextNode(0));
        }
        lastTh2.appendChild(lastDiv);
      }
      lastTr.appendChild(lastTh);
      lastTr.appendChild(lastTh2);
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(resultList[i][0]));
      lastTr.appendChild(lastTh);
      document.getElementById("historyTableBody").appendChild(lastTr);
    }
  } else {
    document.getElementById("inputBottomLeft").children[0].style.display = "none";
  }
  inputDiv.style.display = "block";
}
function loadingPhase() {
  if (addRatioIdle) {
    inputDiv.style.display = "none";
    loadingDiv.style.display = "block";
    for (let i = 0; i < resultList.length; i++) {
      document.getElementById("historyTableBody").lastChild.remove();
    }
    setTimeout(function() {
      try {
        targetRPM(targetList, settingsList);
      } catch {
        loadingDiv.style.display = "none";
        document.getElementById("loadingError").style.display = "flex";
      }
    }, 100);
  }
}
function resultPhase() {
  loadingDiv.style.display = "none";
  resultDiv.style.display = "block";
}
function useResultListToggle() {
  setFocus(4);
  currentSettings[2] = !(currentSettings[2]);
  if (currentSettings[2]) {
    document.getElementById("useHistoryInputText").setAttribute("class", "spaceON");
    document.getElementById("useHistoryInputButton").setAttribute("class", "spaceButtonON");
  } else {
    document.getElementById("useHistoryInputText").setAttribute("class", "spaceOFF");
    document.getElementById("useHistoryInputButton").setAttribute("class", "spaceButtonOFF");
  }
}
function searchGreaterToggle() {
  if (!(currentSettings[3]) || (currentSettings[4] || currentSettings[5])) {
    currentSettings[3] = !(currentSettings[3]);
    if (currentSettings[3]) {
      document.getElementById("searchGreaterInputText").setAttribute("class", "spaceON");
      document.getElementById("searchGreaterInputButton").setAttribute("class", "spaceButtonON");
    } else {
      document.getElementById("searchGreaterInputText").setAttribute("class", "spaceOFF");
      document.getElementById("searchGreaterInputButton").setAttribute("class", "spaceButtonOFF");
    }
  }
}
function searchEqualToggle() {
  if (!(currentSettings[4]) || (currentSettings[3] || currentSettings[5])) {
    currentSettings[4] = !(currentSettings[4]);
    if (currentSettings[4]) {
      document.getElementById("searchEqualInputText").setAttribute("class", "spaceON");
      document.getElementById("searchEqualInputButton").setAttribute("class", "spaceButtonON");
    } else {
      document.getElementById("searchEqualInputText").setAttribute("class", "spaceOFF");
      document.getElementById("searchEqualInputButton").setAttribute("class", "spaceButtonOFF");
    }
  }
}
function searchLowerToggle() {
  if (!(currentSettings[5]) || (currentSettings[3] || currentSettings[4])) {
    currentSettings[5] = !(currentSettings[5]);
    if (currentSettings[5]) {
      document.getElementById("searchLowerInputText").setAttribute("class", "spaceON");
      document.getElementById("searchLowerInputButton").setAttribute("class", "spaceButtonON");
    } else {
      document.getElementById("searchLowerInputText").setAttribute("class", "spaceOFF");
      document.getElementById("searchLowerInputButton").setAttribute("class", "spaceButtonOFF");
    }
  }
}
function pemdas(expr, chars, reverse = false) {
  let result = [];
  for (let i = 0; i < expr.length; i++) {
    if (Array.isArray(expr[i])) {
      result.push(pemdas(expr[i], chars, reverse));
    } else {
      result.push(expr[i]);
    }
  }
  return pemdas2(result, chars, reverse);
}
function pemdas2(result1, chars, reverse) {
  let start = reverse ? result1.length - 1 : 0;
  let incr = reverse ? -1 : 1;
  let result2 = [];
  for (let i = start; i >= 0 && i < result1.length; i += incr) {
    if (chars.some(c => c === result1[i])) {
      let nestedExpr = [result1[i - 1], result1[i], result1[i + 1]];
      result2 = result2.slice(0, -1).concat([nestedExpr]);
      result2 = reverse ? result2.concat(result1.slice(0, i - 1).reverse()).reverse() : result2.concat(result1.slice(i + 2));
      result2 = pemdas2(result2, chars, reverse);
      if (reverse) {
        result2 = result2.reverse();
      }
      break;
    } else {
      result2.push(result1[i]);
    }
  }
  return reverse ? result2.reverse() : result2;
}
function floatConv(nb) {
  if (nb.length === 1) {
    return nb;
  } else {
    return [parseFloat(nb[0]) / parseFloat(nb[1])];
  }
}
function gcd(a, b) {
  if (b === 0n) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}
function reduceFrac(nb) {
  let sign = 1n;
  if (nb[1] < 0n) {
    nb[1] = -nb[1];
    nb[0] = -nb[0];
  }
  if (nb[0] < 0n) {
    sign = -1n;
  }
  let a = gcd(sign * nb[0], nb[1]);
  return [nb[0] / a, nb[1] / a];
}
function solveExpr(expr) {
  if (!(inputError)) {
    try {
      if (expr.length === 3) {
        expr[0] = solveExpr(expr[0]);
        expr[2] = solveExpr(expr[2]);
        if (!(settingsList[settingsList.length - 1][1])) {
          expr[0] = floatConv(expr[0]);
          expr[2] = floatConv(expr[2]);
        }
        if (expr[1] === "+") {
          if (settingsList[settingsList.length - 1][1]) {
            expr[1] = reduceFrac([expr[0][0] * expr[2][1] + expr[2][0] * expr[0][1], expr[0][1] * expr[2][1]]);
          } else {
            expr[1] = [expr[0][0] + expr[2][0]];
          }
        } else {
          if (expr[1] === "-") {
            if (settingsList[settingsList.length - 1][1]) {
              expr[1] = reduceFrac([expr[0][0] * expr[2][1] - expr[2][0] * expr[0][1], expr[0][1] * expr[2][1]]);
            } else {
              expr[1] = [expr[0][0] - expr[2][0]];
            }
          } else {
            if (expr[1] === "*") {
              if (settingsList[settingsList.length - 1][1]) {
                expr[1] = reduceFrac([expr[0][0] * expr[2][0], expr[0][1] * expr[2][1]]);
              } else {
                expr[1] = [expr[0][0] * expr[2][0]];
              }
            } else {
              if (expr[1] === "/") {
                if (settingsList[settingsList.length - 1][1]) {
                  if (expr[2][0] === 0n) {
                    inputError = true;
                    expr[1] = [1n, 1n];
                  } else {
                    expr[1] = reduceFrac([expr[0][0] * expr[2][1], expr[0][1] * expr[2][0]]);
                  }
                } else {
                  if (expr[2][0] === 0) {
                    inputError = true;
                    expr[1] = [1];
                  } else {
                    expr[1] = [expr[0][0] / expr[2][0]];
                  }
                }
              } else {
                if (expr[0][0] === 0 || expr[0][0] === 0n) {
                  if (expr[2][0] > 0) {
                    if (settingsList[settingsList.length - 1][1]) {
                      expr[1] = [0n, 1n];
                    } else {
                      expr[1] = [0];
                    }
                  } else {
                    inputError = true;
                    if (settingsList[settingsList.length - 1][1]) {
                      expr[1] = [1n, 1n];
                    } else {
                      expr[1] = [1];
                    }
                  }
                } else {
                  if (settingsList[settingsList.length - 1][1]) {
                    if (expr[2][1] === 1n) {
                      if (expr[2][0] < 0n) {
                        expr[1] = [expr[0][1] ** -expr[2][0], expr[0][0] ** -expr[2][0]];
                      } else {
                        expr[1] = [expr[0][0] ** expr[2][0], expr[0][1] ** expr[2][0]];
                      }
                    } else {
                      let base = [parseFloat(expr[0][0]), parseFloat(expr[0][1])];
                      let pow_den = parseFloat(expr[2][1]);
                      let test = true;
                      for (let i of [0, 1]) {
                        test = test && BigInt(Math.round(base[i] ** (1 / pow_den))) ** expr[2][1] === expr[0][i];
                      }
                      if (test) {
                        expr[1] = [BigInt(Math.round(base[0] ** (1 / pow_den))) ** expr[2][0]];
                        expr[1].push(BigInt(Math.round(base[1] ** (1 / pow_den))) ** expr[2][0]);
                      } else {
                        settingsList[settingsList.length - 1][1] = false;
                        expr[0] = floatConv(expr[0]);
                        expr[2] = floatConv(expr[2]);
                      }
                    }
                  }
                  if (!(settingsList[settingsList.length - 1][1])) {
                    if (expr[0][0] < 0 && Math.floor(expr[2][0]) !== expr[2][0]) {
                      inputError = true;
                      expr[1] = [1];
                    } else {
                      expr[1] = [expr[0][0] ** expr[2][0]];
                    }
                  }
                }
              }
            }
          }
        }
        return expr[1];
      } else {
        if (Array.isArray(expr[0])) {
          return solveExpr(expr[0]);
        } else {
          return expr;
        }
      }
    } catch {
      inputError = true;
      return [1n, 1n];
    }
  } else {
    return [1n, 1n];
  }
}
function addRatio() {
  if (addRatioIdle) {
    addRatioIdle = false;
    var startingExpr = inputBoxElement.value;
    var inputString = Array.from(startingExpr.split(" ").join(""));
    settingsList.push([]);
    for (i = 0; i < currentSettings.length; i++) {
      settingsList[settingsList.length - 1].push(currentSettings[i]);
    }
    if (!(settingsList[settingsList.length - 1][4])) {
      settingsList[settingsList.length - 1][1] = false;
    } else {
      if (!(settingsList[settingsList.length - 1][3] || settingsList[settingsList.length - 1][5])) {
        settingsList[settingsList.length - 1][1] = true;
      }
    }
    inputError = inputString.length === 0;
    var ongoing;
    let step = 0;
    const nonDigitChar = ["(", ")", "+", "-", "*", "/", "^"];
    while (!(inputError)) {
      if (step === 0) {
        for (i = 0; i < inputString.length; i++) {
          if (!(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "(", ")", "+", "-", "x", "*", "/", "^"].some(c => inputString[i] === c))) {
            if (inputString[i] === ",") {
              inputString[i] = ".";
            } else {
              inputError = true;
            }
          }
        }
      }
      if (step === 1) {
        for (i = 1; i < inputString.length; i++) {
          if (inputString[i] === "*" && inputString[i - 1] === "*") {
            inputString[i - 1] = "^";
            inputString.splice(i, 1);
          }
        }
        for (i = 0; i < inputString.length; i++) {
          if (inputString[i] === "x") {
            inputString.splice(i, 1, "*");
          }
        }
        for (i = 1; i < inputString.length; i++) {
          if (inputString[i] === "(" && !(["(", "+", "-", "*", "/", "^"].some(c => inputString[i - 1] === c))) {
            inputString.splice(i, 0, "*");
          }
        }
        for (i = 0; i < inputString.length - 1; i++) {
          if (inputString[i] === ")" && !(nonDigitChar.some(c => inputString[i + 1] === c))) {
            inputString.splice(i + 1, 0, "*");
          }
        }
        for (i = 0; i < inputString.length; i++) {
          let check = inputString[i] === "-";
          let minusAfterExp = false;
          if (i > 0) {
            check = check && ["(", "+", "-", "*", "/", "^"].some(c => inputString[i - 1] === c);
            minusAfterExp = inputString[i - 1] === "^";
          }
          if (check) {
            let j = i + 1;
            let p = 0;
            ongoing = j < inputString.length;
            while (ongoing) {
              if (inputString[j] === "(") {
                p++;
                j++;
              } else {
                if (p === 0) {
                  if (nonDigitChar.some(c => inputString[j] === c)) {
                    ongoing = false;
                    if (inputString[j] === "^") {
                      if (minusAfterExp) {
                        let k = j + 1;
                        let p2 = 0;
                        let ongoing2 = k < inputString.length;
                        while (ongoing2) {
                          if (inputString[k] === "(") {
                            p2++;
                            k++;
                          } else {
                            if (p2 === 0) {
                              if (nonDigitChar.some(c => inputString[k] === c)) {
                                ongoing2 = false;
                                inputString.splice(k, 0, ")");
                              } else {
                                k++;
                              }
                            } else {
                              if (inputString[k] === ")") {
                                p2--;
                              }
                              k++;
                            }
                          }
                          ongoing2 = ongoing2 && k < inputString.length;
                        }
                        if (p2 === 0 && k === inputString.length) {
                          inputString.push(")");
                        }
                        if (p2 !== 0) {
                          inputError = true;
                        }
                      }
                      inputString.splice(i + 1, 0, "*");
                      inputString.splice(i + 1, 0, ")");
                      inputString.splice(i + 1, 0, "1");
                      inputString.splice(i, 0, "0");
                      inputString.splice(i, 0, "(");
                      if (minusAfterExp) {
                        inputString.splice(i, 0, "(");
                      }
                    } else {
                      inputString.splice(j, 0, ")");
                      inputString.splice(i, 0, "0");
                      inputString.splice(i, 0, "(");
                    }
                  } else {
                    j++;
                  }
                } else {
                  if (inputString[j] === ")") {
                    p--;
                  }
                  j++;
                }
              }
              ongoing = ongoing && j < inputString.length;
            }
            if (p === 0 && inputString[i] === "-") {
              inputString.push(")");
              inputString.splice(i, 0, "0");
              inputString.splice(i, 0, "(");
            }
            if (p !== 0) {
              inputError = true;
            }
          }
        }
        if ([")","+","-","*","/","^"].some(c => inputString[0] === c) || ["(","+","-","*","/","^"].some(c => inputString[inputString.length - 1] === c)) {
          inputError = true;
        }
        for (i = 1; i < inputString.length; i++) {
          if ([")","+","-","*","/","^"].some(c => inputString[i] === c) && ["(","+","-","*","/","^"].some(c => inputString[i - 1] === c)) {
            inputError = true;
          }
        }
      }
      if (step === 2) {
        for (i = 0; i < inputString.length; i++) {
          if (!(nonDigitChar.some(c => inputString[i] === c))) {
            let dots = 0;
            inputString[i] = [inputString[i]];
            ongoing = i + 1 < inputString.length;
            while (ongoing) {
              if (nonDigitChar.some(c => inputString[i + 1] === c)) {
                ongoing = false;
              } else {
                inputString[i].push(inputString[i + 1]);
                if (inputString[i + 1] === ".") {
                  dots++;
                  if (dots > 1) {
                    inputError = true;
                  }
                }
                inputString.splice(i + 1, 1);
                ongoing = i + 1 < inputString.length;
              }
            }
          }
        }
      }
      if (step === 3) {
        for (i = 0; i < inputString.length; i++) {
          if (Array.isArray(inputString[i])) {
            if (settingsList[settingsList.length - 1][1]) {
              let dot = 0;
              while (inputString[i][dot] !== ".") {
                dot++;
                if (inputString[i].length === dot) {
                  inputString[i].push(".");
                }
              }
              inputString[i].splice(dot, 1);
              let zeros = inputString[i].length - dot;
              inputString[i] = [BigInt(inputString[i].join("")), BigInt("1" + "0".repeat(zeros))];
              for (f of [2n, 5n]) {
                let j = 0;
                while (inputString[i][0] % f === 0n && j !== zeros) {
                  inputString[i][0] /= f;
                  inputString[i][1] /= f;
                  j++;
                }
              }
            } else {
              inputString[i] = [parseFloat(inputString[i].join(""))];
            }
          }
        }
        for (i = 0; i < inputString.length; i++) {
          if (inputString[i] === ")") {
            let j = i - 1;
            ongoing = j > -1;
            while (ongoing) {
              if (inputString[j] !== "(") {
                if (j === 0) {
                  inputError = true;
                  ongoing = false;
                } else {
                  j--;
                }
              } else {
                ongoing = false;
              }
            }
            if (inputError) {
              inputString = [];
            } else {
              inputString.splice(j, i - j + 1, inputString.slice(j + 1, i));
              i = j;
            }
          }
        }
        inputError = inputError || inputString.some(c => c === "(");
      }
      if (step === 4) {
        inputString = solveExpr(pemdas(pemdas(pemdas(inputString, ["^"], true), ["*", "/"]), ["+", "-"]));
        if (!(inputString[0] > 0) || isNaN(floatConv(inputString)[0])) {
          inputError = true;
        }
      }
      if (step === 5) {
        let sameInput = -1;
        let checkList = [];
        targetList.push(floatConv(inputString)[0]);
        if (settingsList[settingsList.length - 1][1]) {
          for (i = 0; i < targetRatios.length; i++) {
            if (arraysEqualCheck(targetRatios[i], inputString)) {
              checkList.push(i);
            }
          }
          targetRatios.push(inputString);
        } else {
          for (i = 0; i < targetList.length - 1; i++) {
            if (targetList[i] === inputString[0]) {
              checkList.push(i);
            }
          }
          targetRatios.push([]);
        }
        for (i = 0; i < checkList.length; i++) {
          if (arraysEqualCheck(settingsList[checkList[i]], settingsList[settingsList.length - 1])) {
            sameInput = checkList[i];
            i = checkList.length;
            settingsList.pop();
            targetList.pop();
            targetRatios.pop();
            setFocus(sameInput + infoLength);
          }
        }
        if (sameInput === -1) {
          var lastTr = document.createElement("tr");
          lastTr.id = "inputLine" + targetList.length;
          lastTh = document.createElement("th");
          lastTh.appendChild(document.createTextNode(targetList[targetList.length - 1]));
          var selIndex = document.getElementById("infoInput").childElementCount + 1;
          lastTh.setAttribute("class", "inputCol1");
          lastTh.setAttribute("onclick", "setFocus(" + (selIndex - 1) + ")");
          lastTr.appendChild(lastTh);
          lastTh = document.createElement("th");
          let delRowButton = document.createElement("button");
          delRowButton.setAttribute("class", "delButton");
          delRowButton.setAttribute("type", "button");
          delRowButton.setAttribute("onclick", "delInputIndex(" + (targetList.length - 1) + ")");
          lastTh.appendChild(delRowButton);
          lastTh.setAttribute("class", "inputCol2");
          lastTr.appendChild(lastTh);
          inputTableElement.appendChild(lastTr);
          let lastDiv = document.createElement("div");
          let lastUl = document.createElement("ul");
          let i = settingsList.length - 1;
          lastDiv.setAttribute("class", "selectInfo hiddenDefault");
          lastDiv.appendChild(document.createTextNode("Settings for target #" + (selIndex - infoLength) + ":"));
          if (targetList[targetList.length - 1] != startingExpr) {
            lastUl.appendChild(document.createElement("li"));
            lastUl.lastChild.appendChild(document.createTextNode("Ratio provided = " + startingExpr));
          }
          lastUl.appendChild(document.createElement("li"));
          lastUl.lastChild.appendChild(document.createTextNode("Accuracy = " + settingsList[i][0] + "%"));
          lastUl.appendChild(document.createElement("li"));
          lastUl.lastChild.appendChild(document.createTextNode("Search for "));
          if (settingsList[i][3] && settingsList[i][4] && settingsList[i][5]) {
            lastSpan = document.createElement("span");
            lastSpan.appendChild(document.createTextNode("Greater"));
            lastSpan.setAttribute("class", "spaceON");
            lastUl.lastChild.appendChild(lastSpan);
            lastUl.lastChild.appendChild(document.createTextNode(", "));
            lastSpan = document.createElement("span");
            lastSpan.appendChild(document.createTextNode("Equal"));
            lastSpan.setAttribute("class", "spaceON");
            lastUl.lastChild.appendChild(lastSpan);
            lastUl.lastChild.appendChild(document.createTextNode(" or "));
            lastSpan = document.createElement("span");
            lastSpan.appendChild(document.createTextNode("Lower"));
            lastSpan.setAttribute("class", "spaceON");
            lastUl.lastChild.appendChild(lastSpan);
          } else if (settingsList[i][3] && settingsList[i][4] || settingsList[i][3] && settingsList[i][5] || settingsList[i][4] && settingsList[i][5]) {
            if (!(settingsList[i][3])) {
              lastSpan = document.createElement("span");
              lastSpan.appendChild(document.createTextNode("Equal"));
              lastSpan.setAttribute("class", "spaceON");
              lastUl.lastChild.appendChild(lastSpan);
              lastUl.lastChild.appendChild(document.createTextNode(" or "));
              lastSpan = document.createElement("span");
              lastSpan.appendChild(document.createTextNode("Lower"));
              lastSpan.setAttribute("class", "spaceON");
              lastUl.lastChild.appendChild(lastSpan);
            } else {
              lastSpan = document.createElement("span");
              lastSpan.appendChild(document.createTextNode("Greater"));
              lastSpan.setAttribute("class", "spaceON");
              lastUl.lastChild.appendChild(lastSpan);
              lastUl.lastChild.appendChild(document.createTextNode(" or "));
              if (settingsList[i][4]) {
                lastSpan = document.createElement("span");
                lastSpan.appendChild(document.createTextNode("Equal"));
                lastSpan.setAttribute("class", "spaceON");
                lastUl.lastChild.appendChild(lastSpan);
              } else {
                lastSpan = document.createElement("span");
                lastSpan.appendChild(document.createTextNode("Lower"));
                lastSpan.setAttribute("class", "spaceON");
                lastUl.lastChild.appendChild(lastSpan);
              }
            }
          } else {
            if (settingsList[i][3]) {
              lastSpan = document.createElement("span");
              lastSpan.appendChild(document.createTextNode("Greater"));
              lastSpan.setAttribute("class", "spaceON");
              lastUl.lastChild.appendChild(lastSpan);
            } else if (settingsList[i][4]) {
              lastSpan = document.createElement("span");
              lastSpan.appendChild(document.createTextNode("Equal"));
              lastSpan.setAttribute("class", "spaceON");
              lastUl.lastChild.appendChild(lastSpan);
            } else {
              lastSpan = document.createElement("span");
              lastSpan.appendChild(document.createTextNode("Lower"));
              lastSpan.setAttribute("class", "spaceON");
              lastUl.lastChild.appendChild(lastSpan);
            }
          }
          lastUl.lastChild.appendChild(document.createTextNode(" values"));
          if (resultList.length !== 0) {
            lastUl.appendChild(document.createElement("li"));
            lastSpan = document.createElement("span");
            if (settingsList[i][2]) {
              lastSpan.appendChild(document.createTextNode("Check history"));
              lastSpan.setAttribute("class", "spaceON");
            } else {
              lastSpan.appendChild(document.createTextNode("History ignored"));
              lastSpan.setAttribute("class", "spaceOFF");
            }
            lastUl.lastChild.appendChild(lastSpan);
            lastUl.lastChild.appendChild(document.createTextNode(" for search"));
            lastDiv.appendChild(lastUl);
            lastDiv.appendChild(document.createElement("hr"));
          } else {
            lastDiv.appendChild(lastUl);
          }
          document.getElementById("infoInput").appendChild(lastDiv);
          document.getElementById("inputBottomRight").style.display = "block";
          setFocus(selIndex - 1);
        }
        inputError = true;
      }
      step++;
    }
    if (step !== 6) {
      settingsList.pop();
      if (step !== 0) {
        inputBoxElement.parentElement.parentElement.classList.add("errorInput");
      }
    }
    addRatioIdle = true;
  }
}
function delInputIndex(i) {
  if (delIdle) {
    delIdle = false;
    targetList.splice(i, 1);
    targetRatios.splice(i, 1);
    settingsList.splice(i, 1);
    if (targetList.length === 0) {
      document.getElementById("inputBottomRight").style.display = "none";
    }
    if (focused === i + infoLength) {
      focused = "none";
    } else if (focused > i + infoLength) {
      focused--;
    }
    if (resultList.length === 0 && focused === "none") {
      document.getElementById("inputBottomLeft").children[0].style.display = "none";
    }
    document.getElementById("inputLine" + (i + 1)).remove();
    document.getElementById("infoInput").children[i + infoLength].remove();
    for (let a = i + 1; a < targetList.length + 1; a++) {
      document.getElementById("inputLine" + (a + 1)).id = "inputLine" + a;
      document.getElementById("inputLine" + a).firstChild.setAttribute("onclick", "setFocus(" + (a + infoLength - 1) + ")");
      document.getElementById("inputLine" + a).lastChild.lastChild.setAttribute("onclick", "delInputIndex(" + (a - 1) + ")");
      document.getElementById("infoInput").children[a + infoLength - 1].firstChild.nodeValue = "Settings for target #" + a + ":";
    }
    delIdle = true;
  }
}
function setFocus(i) {
  if (setFocusIdle && focused !== i) {
    setFocusIdle = false;
    document.getElementById("inputBottomLeft").children[0].style.display = "block";
    for (let a of document.getElementById("infoInput").children) {
      a.style.display = "none";
    }
    document.getElementById("infoInput").children[i].style.display = "block";
    if (focused > infoLength - 1) {
      document.getElementsByClassName("focusTarget")[0].classList.remove("focusTarget");
    }
    focused = i;
    if (i > infoLength - 1) {
      document.getElementById("inputLine" + (i + 1 - infoLength)).firstChild.classList.add("focusTarget");
    }
    setFocusIdle = true;
  }
}
function looprs(nbacg, minerror, maxerror, F, sol, L, indexrs) {
  if (L.length === nbacg) {
    let num = 1, den = 1;
    for (let b = 0; b < nbacg; b++) {
      const Lb = L[b];
      if (Lb < 0) {
        num *= 16;
        den *= 17 - Lb;
      } else {
        num *= 17 + Lb;
        den *= 16;
      }
    }
    const c = num / den;
    for (let a = 0; a < minerror.length; a++) {
      for (let b = 0; b < minerror[a].length; b++) {
        if (c >= minerror[a][b] && c <= maxerror[a][b]) {
          sol[a] = sol[a].concat([[L.slice(), c * Math.pow(2, F[a][b]), F[a][b]]]);
        }
      }
    }
  } else {
    for (let a = indexrs; a < 28; a++) {
      L.push(rs[a]);
      looprs(nbacg, minerror, maxerror, F, sol, L, a);
      L.pop();
    }
  }
}
function score(elV) {
  let R = Math.abs(elV[1]);
  for (let elV0 of elV[0]) {
    if (Array.isArray(elV0)) {
      R += 2 * elV0[1];
    } else {
      R += 2;
    }
  }
  return R;
}
function RPMtoAngle(x) {
  if (!(x < 0 || x > 256)) {
    if (x < 900/37) {
      return 3/2 * x;
    } else if (x < 125/3) {
      return 27/55 * x + 270/11;
    } else if (x < 275/3) {
      return 27/70 * x + 405/14;
    } else if (x < 804/7) {
      return 135/487 * x + 132525/3409;
    } else if (x < 204) {
      return 45/208 * x + 2385/52;
    } else {
      return 7/52 * x + 813/13;
    }
  } else {
    return 0;
  }
}
function targetRPM(targets, settings) {
  var failedExactSearches = [];
  var successfulExactSearches = [];
  var L = Array(targets.length).fill([]);
  for (let a = 0; a < targets.length; a++) {
    if (settings[a][1]) {
      let num = targetRatios[a][0];
      let den = targetRatios[a][1];
      let F = [2n, 3n, 5n, 7n, 11n, 13n, 19n, 23n, 29n, 31n];
      let F1 = Array(10).fill(0);
      for (let f = 0; f < 10; f++) {
        while (num % F[f] === 0n) {
          num /= F[f];
          F1[f]++;
        }
        while (den % F[f] === 0n) {
          den /= F[f];
          F1[f]--;
        }
      }
      if (num === den) {
        F = [2, 3, 5, 7, 11, 13, 19, 23, 29, 31];
        let L2 = Array(15).fill(0);
        for (let f = 6; f < 10; f++) {
          L2[F[f] - 18] = F1[f];
        }
        for (let f of [4, 5]) {
          L2[2 * F[f] - 18] = F1[f];
        }
        if (F1[1] * F1[3] > 0) {
          L2[3] = Math.sign(F1[1]) * Math.min(Math.abs(F1[1]), Math.abs(F1[3]));
          L2[10] = F1[3] - L2[3];
          F1[1] -= L2[3];
        } else {
          L2[10] = F1[3];
        }
        L2[7] = Math.sign(F1[2]) * Math.floor(Math.abs(F1[2]) / 2);
        L2[2] = F1[2] - (2 * L2[7]);
        L2[9] = Math.sign(F1[1]) * Math.floor(Math.abs(F1[1]) / 3);
        let b = F1[1] - (3 * L2[9]);
        L2[6 * Math.abs(b % 2)] = Math.sign(b);
        if (L2[2] === L2[6]) {
          L2[12] = L2[2];
          L2[2] = 0;
          L2[6] = 0;
        }
        let sumL2 = 0, seqLen = 0;
        for (l of L2) {
          sumL2 += l;
          seqLen += Math.abs(l);
        }
        L2[14] = F1[0] + 4 * sumL2;
        let F2 = [1, 2, 1, 3, 1, 2, 1];
        for (let i = 0; i < 7; i++) {
          L2[14] -= L2[2 * i] * F2[i];
        }
        let R = [];
        for (let b = 13; b >= 0; b--) {
          if (L2[b] < 0) {
            if (L2[b] > -5) {
              R = R.concat(Array(-L2[b]).fill(-b - 1));
            } else {
              R.push([-b - 1, -L2[b]]);
            }
          }
        }
        for (let b = 0; b < 14; b++) {
          if (L2[b] > 0) {
            if (L2[b] < 5) {
              R = R.concat(Array(L2[b]).fill(b + 1));
            } else {
              R.push([b + 1, L2[b]]);
            }
          }
        }
        let L_a = [[]];
        if (seqLen < 7) {
          let error = [[]], F = [[]];
          for (let fact = -Math.abs(L2[14]); fact < Math.abs(L2[14]) + 1; fact++) {
            error[0] = error[0].concat([targets[a] * Math.pow(2, -fact)]);
            F[0] = F[0].concat([fact]);
          } 
          looprs(seqLen, error, error, F, L_a, [], 0);
        }
        L[a] = L_a[0].length === 0 ? [[R, targets[a], L2[14]]] : L_a[0];
        successfulExactSearches.push(a);
      } else {
        failedExactSearches.push(a);
      }
    }
  }
  settings_ = [];
  _index = [];
  for (i = 0; i < settings.length; i++) {
    settings_.push(settings[i]);
    _index.push(i);
  }
  for (i = successfulExactSearches.length - 1; i > -1; i--) {
    settings_.splice(successfulExactSearches[i], 1);
    _index.splice(successfulExactSearches[i], 1);
  }
  for (i = settings_.length - 1; i > -1; i--) {
    if (!(settings_[i][3] || settings_[i][5])) {
      settings_.splice(i, 1);
      L[_index[i]] = [[[], "NO SOLUTION", ""]];
      _index.splice(i, 1);
    }
  }
  let targets_ = [];
  for (i = 0; i < targets.length; i++) {
    if (L[i].length === 0) {
      if (targets[i] === Infinity) {
        settings_.splice(i, 1);
        L[i] = [[[], "TOO LARGE", ""]];
        _index.splice(i, 1);
      } else if (targets[i] === 0) {
        settings_.splice(i, 1);
        L[i] = [[[], "TOO SMALL", ""]];
        _index.splice(i, 1);
      } else {
        targets_.push(targets[i]);
      }
    }
  }
  let targets2 = [];
  for (let a of targets_) {
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
  let L_ = Array(targets_.length).fill([]);
  let F = Array(targets_.length).fill([]);
  let a = 0;
  let minerror = Array(targets_.length).fill([]);
  let maxerror = Array(targets_.length).fill([]);
  for (let b = 0; b < targets_.length; b++) {
    for (let c = 0; c < targets2[b].length; c++) {
      minerror[b] = minerror[b].concat([targets2[b][c][0] * (1 - settings_[b][0] / 100)]);
      maxerror[b] = maxerror[b].concat([targets2[b][c][0] * (1 + settings_[b][0] / 100)]);
      F[b] = F[b].concat([targets2[b][c][1]]);
      if (resultList.some(r => r[0] > minerror[b][c] && r[0] < maxerror[b][c]) && settings_[b][2]) {
        for (let r of resultList) {
          if (r[0] > minerror[b][c] && r[0] < maxerror[b][c]) {
            for (let d = 0; d < r[1].length; d++) {
              L_[b] = L_[b].concat([[r[1][d][0], r[0] * Math.pow(2, F[b][c]), r[1][d][1] + F[b][c]]]);
            }
          }
        }
      }
    }
  }
  let ongoing = true;
  while (ongoing) {
    looprs(a, minerror, maxerror, F, L_, [], 0);
    a++;
    ongoing = false;
    for (let b = 0; b < targets_.length; b++) {
      l = 0;
      while (l < L_[b].length) {
        let notInDom, t1, t2;
        if (targetRatios[_index[b]].length === 0) {
          t1 = L_[b][l][1];
          t2 = targets_[b];
        } else {
          let resultRatio = [1n, 1n];
          for (let ACG of L_[b][l][0]) {
            if (ACG < 0) {
              resultRatio[0] *= 16n;
              resultRatio[1] *= 17n + BigInt(-ACG);
            } else {
              resultRatio[0] *= 17n + BigInt(ACG);
              resultRatio[1] *= 16n;
            }
          }
          resultRatio = reduceFrac(resultRatio);
          if (L_[b][l][2] < 0) {
            t1 = resultRatio[0] * targetRatios[_index[b]][1];
            t2 = BigInt(Math.pow(2, -L_[b][l][2])) * targetRatios[_index[b]][0] * resultRatio[1];
          } else {
            t1 = BigInt(Math.pow(2, L_[b][l][2])) * resultRatio[0] * targetRatios[_index[b]][1];
            t2 = targetRatios[_index[b]][0] * resultRatio[1];
          }
        }
        if (settings_[b][3]) {
          if (settings_[b][4]) {
            if (!(settings_[b][5])) {
              notInDom = t1 < t2;
            }
          } else {
            if (settings_[b][5]) {
              notInDom = t1 === t2;
            } else {
              notInDom = t1 <= t2;
            }
          }
        } else {
          if (settings_[b][4]) {
            if (settings_[b][5]) {
              notInDom = t1 > t2;
            } else {
              notInDom = t1 !== t2;
            }
          } else {
            notInDom = t1 >= t2;
          }
        }
        if (notInDom) {
          L_[b].splice(l, 1);
        } else {
          l++;
        }
      }
    }
    let toRemove = [];
    for (let b = 0; b < targets_.length; b++) {
      if (L_[b].length === 0) {
        ongoing = true;
      } else {
        toRemove.push(b);
      }
    }
    for (let removeIndex = toRemove.length - 1; removeIndex > -1; removeIndex--) {
      L[_index[toRemove[removeIndex]]] = L_[toRemove[removeIndex]];
      minerror.splice(toRemove[removeIndex], 1);
      maxerror.splice(toRemove[removeIndex], 1);
      F.splice(toRemove[removeIndex], 1);
      targets_.splice(toRemove[removeIndex], 1);
      settings_.splice(toRemove[removeIndex], 1);
      _index.splice(toRemove[removeIndex], 1);
    }
    L_ = Array(targets_.length).fill([]);
  }
  for (let b = 0; b < targets.length; b++) {
    if (L[b][0][2] === "") {
      var lastTr = document.createElement("tr");
      lastTr.id = "resultLine" + (b + 1);
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(targetList[b]));
      lastTr.appendChild(lastTh);
      lastTr.appendChild(document.createElement("th"));
      lastTr.appendChild(document.createElement("th"));
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(L[b][0][1]));
      lastTr.appendChild(lastTh);
      lastTr.setAttribute("class", "noSolution");
      resultTableElement.appendChild(lastTr);
    } else {
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
      for (let i = 0; i < V.length; i++) {
        let current = -14;
        let n = 0;
        let a0 = [];
        for (let el of V[i][0]) {
          if (el !== current) {
            if (n < 5) {
              for (let c = 0; c < n; c++) {
                a0.push(current);
              }
            } else {
              a0.push([current, n]);
            }
            current = el;
            n = 1;
          } else {
            n++;
          }
        }
        if (n < 5) {
          for (let c = 0; c < n; c++) {
            a0.push(current);
          }
        } else {
          a0.push([current, n]);
        }
        V[i][0] = a0;
      }
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
      lastTr.id = "resultLine" + (b + 1);
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(targetList[b]));
      lastTr.appendChild(lastTh);
      lastTh = document.createElement("th");
      lastTh2 = document.createElement("th");
      for (let a of V) {
        if (score(a) === best) {
          resultDiv.classList.replace("setupDispOFF", "setupDispON");
          let negList = [];
          let posList = [];
          for (let c of a[0]) {
            if (Array.isArray(c)) {
              if (c[0] < 0) {
                negList = negList.concat(Array(c[1]).fill(c[0]));
              } else {
                posList = posList.concat(Array(c[1]).fill(c[0]));
              }
            } else {
              if (c < 0) {
                negList.push(c);
              } else {
                posList.push(c);
              }
            }
          }
          let ACGgridList = [];
          if (negList.length > posList.length) {
            for (let excessIndex = 0; excessIndex < negList.length - posList.length; excessIndex++) {
              ACGgridList.push([0, negList[excessIndex]]);
            }
            for (let overlapIndex = 0; overlapIndex < posList.length; overlapIndex++) {
              ACGgridList.push([posList[overlapIndex], negList[ACGgridList.length]]);
            }
          } else {
            for (let overlapIndex = 0; overlapIndex < negList.length; overlapIndex++) {
              ACGgridList.push([posList[overlapIndex], negList[overlapIndex]]);
            }
            for (let excessIndex = 0; excessIndex < posList.length - negList.length; excessIndex++) {
              ACGgridList.push([posList[ACGgridList.length], 0]);
            }
          }
          let ACGindex = 0;
          let repeatList = [];
          while (ACGindex < ACGgridList.length) {
            let identical = 1;
            let ongoing = ACGindex + 1 < ACGgridList.length;
            while (ongoing) {
              if (arraysEqualCheck(ACGgridList[ACGindex + identical], ACGgridList[ACGindex])) {
                identical++;
                ongoing = ACGindex + identical < ACGgridList.length;
              } else {
                ongoing = false;
              }
            }
            if (identical < 6) {
              ACGindex += identical;
            } else {
              ACGgridList.splice(ACGindex, identical - 2 - (identical % 2));
              repeatList.push([ACGindex, Math.floor(identical / 2)]);
              ACGindex += 2 + (identical % 2);
            }
          }
          let swapPairs;
          if (a[1] < 0) {
            swapPairs = (-a[1] + 1) % 2;
            if (-a[1] < 6) {
              ACGgridList = Array(-a[1]).fill(["small", "large"]).concat(ACGgridList);
              for (let r = 0; r < repeatList.length; r++) {
                repeatList[r][0] += -a[1];
              }
            } else {
              ACGgridList = Array(2 + ((-a[1]) % 2)).fill(["small", "large"]).concat(ACGgridList);
              for (let r = 0; r < repeatList.length; r++) {
                repeatList[r][0] += 2 + ((-a[1]) % 2);
              }
              repeatList.unshift([0, Math.floor(-a[1] / 2)]);
            }
          } else {
            swapPairs = (ACGgridList.length + 1) % 2;
            if (a[1] < 6) {
              ACGgridList = ACGgridList.concat(Array(a[1]).fill(["large", "small"]));
            } else {
              repeatList.push([ACGgridList.length, Math.floor(a[1] / 2)]);
              ACGgridList = ACGgridList.concat(Array(2 + (a[1] % 2)).fill(["large", "small"]));
            }
          }
          for (let swapIndex = swapPairs; swapIndex < ACGgridList.length; swapIndex += 2) {
            ACGgridList[swapIndex] = [ACGgridList[swapIndex][1], ACGgridList[swapIndex][0]];
          }
          let shaftOnTop = swapPairs === 1;
          let gridElement = document.createElement("div");
          gridElement.setAttribute("class", "ACGgrid");
          if (shaftOnTop) {
            gridElement.appendChild(libraryDiv.getElementsByClassName("speedometer")[0].cloneNode(true));
            gridElement.lastChild.classList.add("row1");
            gridElement.appendChild(document.createElement("div"));
          } else {
            gridElement.appendChild(document.createElement("div"));
            gridElement.appendChild(libraryDiv.getElementsByClassName("speedometer")[0].cloneNode(true));
            gridElement.lastChild.classList.add("row2");
            if (a[1] < 0) {
              gridElement.lastChild.classList.add("high");
            }
          }
          for (let ACGindex2 = 0; ACGindex2 < ACGgridList.length; ACGindex2++) {
            if (shaftOnTop) {
              gridElement.appendChild(libraryDiv.getElementsByClassName("shaft")[0].cloneNode(true));
              gridElement.appendChild(document.createElement("div"));
            } else {
              gridElement.appendChild(document.createElement("div"));
              gridElement.appendChild(libraryDiv.getElementsByClassName("shaft")[0].cloneNode(true));
              if (ACGgridList[ACGindex2].some(c => c === "large")) {
                gridElement.lastChild.classList.add("high");
              }
            }
            if (repeatList.length > 0) {
              if (repeatList[0][0] === ACGindex2) {
                let repeatParent = gridElement.children[gridElement.children.length - 2];
                repeatParent.prepend(libraryDiv.getElementsByClassName("repeat")[0].cloneNode(true));
                repeatParent.firstChild.children[6].children[0].appendChild(document.createTextNode("x" + repeatList[0][1]));
                repeatList.shift();
              }
            }
            if (ACGgridList[ACGindex2].some(c => c === "large")) {
              gridElement.appendChild(libraryDiv.getElementsByClassName(ACGgridList[ACGindex2][0])[0].cloneNode(true));
              gridElement.appendChild(libraryDiv.getElementsByClassName(ACGgridList[ACGindex2][1])[0].cloneNode(true));
              gridElement.lastChild.classList.add("high");
            } else {
              gridElement.appendChild(libraryDiv.getElementsByClassName("row1")[0].cloneNode(true));
              if (ACGgridList[ACGindex2][0] === 0) {
                gridElement.lastChild.classList.add("ECD");
              } else {
                gridElement.lastChild.classList.add("ACG");
                if (ACGgridList[ACGindex2][0] > 0) {
                  gridElement.lastChild.children[3].classList.add("inputNotes");
                  gridElement.lastChild.children[3].children[0].appendChild(document.createTextNode(ACGgridList[ACGindex2][0]));
                } else {
                  gridElement.lastChild.children[3].classList.add("outputNotes");
                  gridElement.lastChild.children[3].children[0].appendChild(document.createTextNode(-ACGgridList[ACGindex2][0]));
                }
              }
              gridElement.appendChild(libraryDiv.getElementsByClassName("row2")[0].cloneNode(true));
              if (ACGgridList[ACGindex2][1] === 0) {
                gridElement.lastChild.classList.add("ECD");
              } else {
                gridElement.lastChild.classList.add("ACG");
                if (ACGgridList[ACGindex2][1] > 0) {
                  gridElement.lastChild.children[4].classList.add("inputNotes");
                  gridElement.lastChild.children[4].children[0].appendChild(document.createTextNode(ACGgridList[ACGindex2][1]));
                } else {
                  gridElement.lastChild.children[4].classList.add("outputNotes");
                  gridElement.lastChild.children[4].children[0].appendChild(document.createTextNode(-ACGgridList[ACGindex2][1]));
                }
              }
            }
            shaftOnTop = !(shaftOnTop);
          }
          if (shaftOnTop) {
            gridElement.appendChild(libraryDiv.getElementsByClassName("shaft")[0].cloneNode(true));
            gridElement.appendChild(document.createElement("div"));
            gridElement.appendChild(libraryDiv.getElementsByClassName("speedometer")[0].cloneNode(true));
            gridElement.lastChild.classList.add("row1");
          } else {
            gridElement.appendChild(document.createElement("div"));
            gridElement.appendChild(libraryDiv.getElementsByClassName("shaft")[0].cloneNode(true));
            gridElement.appendChild(document.createElement("div"));
            gridElement.appendChild(libraryDiv.getElementsByClassName("speedometer")[0].cloneNode(true));
            gridElement.lastChild.classList.add("row2");
            if (a[1] > 0) {
              gridElement.lastChild.classList.add("high");
              gridElement.children[gridElement.children.length - 3].classList.add("high");
            }
          }
          let speedInOut = [0, 0];
          if (closest < 256) {
            speedInOut = [1, closest];
          } else if (closest < 2560) {
            speedInOut = [0.1, closest / 10];
          } else if (closest < 25600) {
            speedInOut = [0.01, closest / 100];
          } else if (closest !== Infinity) {
            speedInOut[1] = closest;
            while (!(speedInOut[1] < 256)) {
              speedInOut[1] /= 10;
            }
          } else {
            let c = [Array.from(String(targetRatios[b][0])), Array.from(String(targetRatios[b][1]))];
            for (d of [0, 1]) {
              if (c[d].length > 7) {
                c[d].splice(7, c[d].length - 7);
              }
              c[d] = parseInt(String(c[d]).split(",").join(""));
            }
            speedInOut[1] = c[0] / c[1];
            while (!(speedInOut[1] < 256)) {
              speedInOut[1] /= 10;
            }
            while (speedInOut[1] < 25.6) {
              speedInOut[1] *= 10;
            }
          }
          let speedCat;
          for (d of [0, 1]) {
            gridElement.getElementsByClassName("dialRotate")[d].style.transform = "rotate(" + RPMtoAngle(speedInOut[d]) + "deg)";
            let dispDiv = gridElement.getElementsByClassName("goggle")[d].children[3];
            if (speedInOut[d] < 1) {
              speedCat = "None";
            } else if (speedInOut[d] < 30) {
              speedCat = "Slow";
            } else if (speedInOut[d] < 100) {
              speedCat = "Moderate";
            } else {
              speedCat = "Fast";
            }
            dispDiv.classList.add("speed" + speedCat);
            dispDiv.children[3].appendChild(document.createTextNode(speedCat + " (" + (-Math.round(-100 * speedInOut[d]) / 100) + " RPM)"));
          }
          let lastDiv = document.createElement("div");
          lastDiv.appendChild(gridElement);
          lastDiv.classList.add("scrollContainer");
          gridListElement.appendChild(lastDiv);
          if (!resultList[i][1].some(c => arraysEqualCheck(c, a))) {
            resultList[i][1].push(a);
          }
          lastDiv = document.createElement("div");
          for (let c of a[0]) {
            lastSpan = document.createElement("span");
            if (Array.isArray(c)) {
              lastSpan.appendChild(document.createElement("span"));
              lastSpan.appendChild(document.createElement("span"));
              lastSpan.setAttribute("class", "ACGMult");
              lastSpan.children[1].appendChild(document.createTextNode("x" + c[1]));
              if (c[0] < 0) {
                lastSpan.children[0].setAttribute("class", "ACGNeg");
                lastSpan.children[0].appendChild(document.createTextNode(-c[0]));
              } else {
                lastSpan.children[0].setAttribute("class", "ACGPos");
                lastSpan.children[0].appendChild(document.createTextNode(c[0]));
              }
            } else if (c < 0) {
              lastSpan.setAttribute("class", "ACGNeg");
              lastSpan.appendChild(document.createTextNode(-c));
            } else {
              lastSpan.setAttribute("class", "ACGPos");
              lastSpan.appendChild(document.createTextNode(c));
            }
            lastDiv.appendChild(lastSpan);
          }
          lastTh.appendChild(lastDiv);
          lastDiv = document.createElement("div");
          if (a[1] > 0) {
            lastDiv.setAttribute("class", "doublePos");
            lastDiv.appendChild(document.createTextNode(a[1]));
          } else if (a[1] < 0) {
            lastDiv.setAttribute("class", "doubleNeg");
            lastDiv.appendChild(document.createTextNode(-a[1]));
          } else {
            lastDiv.setAttribute("class", "double0");
            lastDiv.appendChild(document.createTextNode(0));
          }
          lastTh2.appendChild(lastDiv);
        }
      }
      lastTr.appendChild(lastTh);
      lastTr.appendChild(lastTh2);
      lastTh = document.createElement("th");
      lastTh.appendChild(document.createTextNode(closest));
      if (successfulExactSearches.length !== 0) {
        if (successfulExactSearches[0] === b) {
          lastTh.setAttribute("class", "successExact");
          successfulExactSearches.shift();
        }
      }
      lastTr.appendChild(lastTh);
      resultTableElement.appendChild(lastTr);
    }
  }
  resultPhase();
}
document.body.onload = inputPhase();
inputBoxElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    currentSettings[0] = document.getElementById("inputAccuracy").value;
    addRatio();
  }
});
document.addEventListener("transitionend", (event) => {
  inputBoxElement.parentElement.parentElement.classList.remove("errorInput");
});
