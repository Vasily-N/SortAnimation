const QuickSort = (a, left, right) => {
  let i = left, j = right;
  const p = a[left];
  _reports.push(new Report(i, j, ReportType.Zone));

  while (i <= j) {
    _reports.push(new Report(i, j, ReportType.Select));

    while (a[i] < p) {
      i++;
      _reports.push(new Report(i, j, ReportType.Select));
    }

    while (a[j] > p) {
      j--;
      _reports.push(new Report(i, j, ReportType.Select));
    }

    if (i > j) break;
    if (a[i] != a[j]) {
      [a[i], a[j]] = [a[j], a[i]];
      _reports.push(new Report(i, j, ReportType.Sort));
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
  constructor(i, j, type = ReportType.Sort) {
    Object.assign(this, {_i: i, _j: j, _type: type});
  }

  get I() { return this._i };
  get J() { return this._j };
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

const NextStep = () => {
  const ResetStyles = () => {
    _block.querySelectorAll('.zone').forEach(v => v.classList.remove('zone'));
    _block.querySelectorAll('.active').forEach(v => v.classList.remove('active'));
  }

  ResetStyles();
  if (_reports.length == 0) {
    return; 
  }

  const r = _reports.shift();
  if (r.Type == ReportType.Zone) {
    _rZone = r;
  }

  _arrDiv[_rZone.I].classList.add('zone');
  _arrDiv[_rZone.J].classList.add('zone');

  if (r.Type == ReportType.Zone) {
    setTimeout(NextStep, waitTime);
    return;
  }

  const { I:i, J:j } = r;
  _arrDiv[i].classList.add('active');
  _arrDiv[j].classList.add('active');

  if(r.Type != ReportType.Sort) {
    setTimeout(NextStep, waitTime / 10);
    return;
  }

  [_arrDiv[i], _arrDiv[j]] = [_arrDiv[j], _arrDiv[i]];
  [_arrDiv[i].style.top, _arrDiv[j].style.top] = [GetTop(i), GetTop(j)];

  setTimeout(NextStep, animationTime + waitTime);
}

Start();
