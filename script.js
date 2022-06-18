const QuickSort = (a, left, right) => {
  let i = left;
  let j = right;
  const p = a[left];
  _reports.push(new Report(i, j, ReportType.Zone));

  while (i <= j) {
      while (a[i] < p) {
        i++;
        _reports.push(new Report(i, j, ReportType.Select));
      }
      while (a[j] > p) {
        j--;
        _reports.push(new Report(i, j, ReportType.Select));
      }
      if (i > j) continue; 
      if (a[i] != a[j]) {
          [a[i], a[j]] = [a[j], a[i]];
          _reports.push(new Report(i, j));
      }

      i++;
      j--;
      _reports.push(new Report(i, j, ReportType.Select));
  }

  if (j > left) QuickSort(a, left, j);
  if (i < right) QuickSort(a, i, right);

  return a;
}

const _block = document.getElementById('block');
const _btnSort = document.getElementById('sort');
let _arr, _arrDiv;
const ARR_LENGTH = 30;

const L_HEIGHT = 16; //todo: get from style
const L_Y_INTERVAL = 4;
const L_MULT = 20;

//todo: from UI
let animationTime = 000; //todo: get from style
let waitTime = 000;

let _reportsI;
let _reports;

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
  _reportsI = 0;
  _reports = [];
  _rZone = undefined;
  QuickSort(_arr, 0, _arr.length - 1);
  NextStep();
}

const GetPosition = i => i * (L_HEIGHT + L_Y_INTERVAL);

const Start = () => {
  _arr = [];
  _arrDiv = [];

  for (let i = 0; i < ARR_LENGTH; i++) {
      const val = Math.floor(Math.random() * ARR_LENGTH + 1);
      _arr[i] = val;
      const div = document.createElement('div');
      div.classList.add('row');
      div.innerHTML = val;
      const style = { top: `${GetPosition(i)}px`, width: `${L_MULT * val}px`};
      Object.assign(div.style, style);
      _arrDiv[i] = div;
      _block.appendChild(div);
  }

  _btnSort.addEventListener('click', BtnSort);
}

let _rZone;
const NextStep = () => {
    const ResetStyles = () => {
      _block.querySelectorAll('.zone').forEach(v => v.classList.remove('zone'));
      _block.querySelectorAll('.active').forEach(v => v.classList.remove('active'));
    }

    ResetStyles();
    if (_reportsI >= _reports.length) { 
      return; 
    }

    const r = _reports[_reportsI++];
    if (r.Type == ReportType.Zone) {
      _rZone = r;
    }

    _arrDiv[_rZone.I].classList.add('zone');
    _arrDiv[_rZone.J].classList.add('zone');

    if (r.Type == ReportType.Zone) {
      setTimeout(NextStep, waitTime);
      return;
    }

    if(_arrDiv[r.I]) _arrDiv[r.I].classList.add('active');
    if(_arrDiv[r.J]) _arrDiv[r.J].classList.add('active');
    if(r.Type != ReportType.Sort) {
      setTimeout(NextStep, waitTime / 10  );
      return;
    }
    _arrDiv[r.I].style.top = `${GetPosition(r.J)}px`;
    _arrDiv[r.J].style.top = `${GetPosition(r.I)}px`;
    [_arrDiv[r.I], _arrDiv[r.J]] = [_arrDiv[r.J], _arrDiv[r.I]]
    setTimeout(NextStep, animationTime + waitTime);
}

Start();
