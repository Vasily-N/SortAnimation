const QuickSort = (a, left, right) => {
  let i = left;
  let j = right;
  const p = a[left];
  _reports.push(new Report(i, j, ReportType.Zone));

  while (i <= j) {
      while (a[i] < p) i++;
      while (a[j] > p) j--;
      if (i > j) continue; 
      if (a[i] != a[j]) {
          [a[i], a[j]] = [a[j], a[i]];
          _reports.push(new Report(i, j));
      }

      i++;
      j--;
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
let animationTime = 1500;
let animationInterval = 10;
let waitTime = 1000;

let _reportsI;
let _reports;

const ReportType = {Sort : 0, Zone: 1}; //enum?
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
  _rMove = undefined;
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

let _rMove;
let _rZone;
let _topI;
let _topJ;

const NextStep = () => {
    const ResetStyles = () => {
      _block.querySelectorAll('.zone').forEach(v => v.classList.remove('zone'));
      _block.querySelectorAll('.active').forEach(v => v.classList.remove('active'));
    }

    ResetStyles();
    if (_reportsI >= _reports.Count) { 
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

    _arrDiv[r.I].classList.add('active');
    _arrDiv[r.J].classList.add('active');
    _rMove = r;
    _animFrame = 0;
    _topI = GetPosition(r.I);
    _topJ = GetPosition(r.J);
    tAnimFrame = setInterval(animFrameTick, )
}

let tAnimFrame; 
let _animFrame;
const animFrameTick = () => {
  _animFrame++;
  const dif = (_topJ - _topI) * (_animFrame * animationInterval) / animationTime;
  _arrDiv[_rMove.I].style.top = `${Math.min(_topI + dif, _topJ)}px`;
  _arrDiv[_rMove.J].style.top = `${Math.max(_topJ - dif, _topI)}px`;

  if (_animFrame * animationInterval < animationTime) return;
  [_arrDiv[_rMove.I], _arrDiv[_rMove.J]] = [_arrDiv[_rMove.J], _arrDiv[_rMove.I]];
  clearInterval(tAnimFrame);
  setTimeout(NextStep, waitTime);
}

Start();
