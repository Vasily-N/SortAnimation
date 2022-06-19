const QuickSort = (a, left, right) => {
  let i = left, j = right;
  const p = a[left];
  _reports.push(new Report(ReportType.Zone, i, j));

  while (i <= j) {
    _reports.push(new Report(ReportType.Select, i, j));

    while (a[i] < p) {
      i++;
      _reports.push(new Report(ReportType.Select, i, j));
    }

    while (a[j] > p) {
      j--;
      _reports.push(new Report(ReportType.Select, i, j));
    }

    if (i > j) break;
    if (a[i] != a[j]) {
      [a[i], a[j]] = [a[j], a[i]];
      _reports.push(new Report(ReportType.Sort, i, j));
    }

    i++; j--;
  }

  if (j > left) QuickSort(a, left, j);
  if (i < right) QuickSort(a, i, right);

  return a;
}

const _block = document.getElementById('block');
const _btnSort = document.getElementById('sort');
let _arrDiv;

let _arr;
const ARR_LENGTH = 30;

const L_HEIGHT = 16; //todo: get from style
const L_Y_INTERVAL = 4;
const L_MULT = 20;

//todo: from UI
let animationTime = 1000; //todo: get from style
let waitTime = 1000;

let _reports;
let _rZone;

const ReportType = {Sort : 0, Zone: 1, Select: 2}; //enum?
class Report {
  constructor(type, ...coords) {
    Object.assign(this, {_coords: coords, _type: type});
  }

  get Coords() { return [...this._coords]; };
  get Type() { return this._type; }
}

const BtnSort = () => {
  _reports = [];
  _rZone = undefined;
  QuickSort(_arr, 0, _arr.length - 1);
  NextStep();
}

const GetTop = i => `${i * (L_HEIGHT + L_Y_INTERVAL)}px`;

const Start = () => {
  _arr = [];
  _arrDiv = [];

  for (let i = 0; i < ARR_LENGTH; i++) {
    const val = Math.floor(Math.random() * ARR_LENGTH + 1);
    _arr[i] = val;
    const div = document.createElement('div');
    div.classList.add('row');
    div.innerHTML = val;
    const style = { top: GetTop(i), width: `${L_MULT * val}px`};
    Object.assign(div.style, style);
    _arrDiv[i] = div;
    _block.appendChild(div);
  }

  _btnSort.addEventListener('click', BtnSort);
}

const removeZone = v => v.classList.remove('zone');
const addZone = v => v.classList.add('zone');
const removeActive = v => v.classList.remove('active');
const addActive = v => v.classList.add('active');

const NextStep = () => {
  const RemoveActive = () => _block.querySelectorAll('.active').forEach(removeActive);
  const RemoveZones = () => _block.querySelectorAll('.zone').forEach(removeZone);

  RemoveActive();
  if (_reports.length == 0) {
    RemoveZones();
    return; 
  }

  const r = _reports.shift();
  if (r.Type == ReportType.Zone) {
    RemoveZones();
    _rZone = r;
    _rZone.Coords.forEach(v => addZone(_arrDiv[v]))
    setTimeout(NextStep, waitTime);
    return;
  }

  const coords = r.Coords;
  coords.forEach(v => addActive(_arrDiv[v]));

  if(r.Type != ReportType.Sort) {
    setTimeout(NextStep, waitTime / 10);
    return;
  }

  const updateZone = coords.filter(v => _rZone.Coords.includes(v));
  updateZone.forEach(v => removeZone(_arrDiv[v]));

  const [i, j] = coords;
  [_arrDiv[i], _arrDiv[j]] = [_arrDiv[j], _arrDiv[i]];
  [_arrDiv[i].style.top, _arrDiv[j].style.top] = [GetTop(i), GetTop(j)];

  updateZone.forEach(v => addZone(_arrDiv[v]));

  setTimeout(NextStep, animationTime + waitTime);
}

Start();
