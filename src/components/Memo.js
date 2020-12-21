import React from 'react';

function Memo({
  memo,
  onMemoTextChange,
  placeOnTop,
  changeDragMoveState,
  closeMemo,
}) {
  const { id, left, top, zIndex, width, height, text } = memo;

  const handleMemoTextChange = (e) => {
    onMemoTextChange(id, e.target.value); // 해당 메모의 내용 변경
  };

  const handleHeaderMouseDown = (e) => {
    // 메모의 헤더부분 좌클릭 시
    if (e.button === 0) {
      placeOnTop(id); // 해당 메모를 최상단으로 배치 (z-index 최대)
      changeDragMoveState(id, e); // 메모 이동 목적의 드래그 상태로 설정
      return;
    }
  };

  const handleTextareaMouseDown = (e) => {
    // 메모 텍스트 영역 좌클릭 시
    if (e.button === 0) {
      placeOnTop(id); // 해당 메모를 최상단으로 배치 (z-index 최대)
      return;
    }
  };

  const handleCloseClick = () => {
    closeMemo(id);
  };

  return (
    <div className="memo" style={{ left, top, zIndex }}>
      <div className="header" onMouseDown={handleHeaderMouseDown}>
        <h1 className="blind">메모장</h1>
        <button className="btn_close" onClick={handleCloseClick}>
          <span className="blind">닫기</span>
        </button>
      </div>
      <div className="content">
        <textarea
          className="textarea"
          style={{ width, height }}
          onChange={handleMemoTextChange}
          onMouseDown={handleTextareaMouseDown}
          value={text}
        ></textarea>
      </div>
    </div>
  );
}

export default Memo;
