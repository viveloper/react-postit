import { useCallback, useState } from 'react';
import Memo from './components/Memo';
import { generateGUID } from './modules/utils';

function App() {
  const [memoList, setMemoList] = useState([
    {
      id: generateGUID(),
      left: 100,
      top: 100,
      zIndex: 1,
      width: 200,
      height: 100,
      text: 'memo',
    },
  ]);
  const [dragMoveState, setDragMoveState] = useState({
    isDragging: false,
    targetDragMemoId: '',
    mouseOffsetX: 0,
    mouseOffsetY: 0,
  });

  const handleMouseDown = (e) => {
    // 바탕화면(회색부분)에 마우스 우클릭 시
    if (e.target.className === 'wrap' && e.button === 2) {
      createMemo(e.pageX, e.pageY); // 새로운 메모 생성
      return;
    }

    // 바탕화면(회색부분)에 마우스 좌클릭 시
    if (e.target.className === 'wrap' && e.button === 0) return; // 무시
  };

  const handleMouseMove = (e) => {
    // 메모 이동을 위한 드래그 발생 시
    if (dragMoveState.isDragging) {
      moveMemo(e); // 해당 메모의 위치 변경
      return;
    }
  };

  const handleMouseUp = (e) => {
    // 드래그 중 마우스를 놓았을 때
    if (dragMoveState.isDragging) {
      resetDragMoveState(); // 드래그 상태 초기화
      return;
    }
  };

  const handleContextMenu = (e) => {
    // 마우스 우클릭 시, textarea에서만 메뉴가 나타나도록 설정
    if (e.target.className !== 'textarea') {
      e.preventDefault();
      return;
    }
  };

  const createMemo = (left, top) => {
    // 새로운 메모 생성
    const newMemo = {
      id: generateGUID(),
      left,
      top,
      zIndex: Math.max(...memoList.map((memo) => memo.zIndex)) + 1,
      width: 200,
      height: 100,
      text: '',
    };
    setMemoList([...memoList, newMemo]);
  };

  const changeText = useCallback(
    (memoId, text) => {
      // 메모의 내용 변경
      setMemoList(
        memoList.map((memo) =>
          memo.id === memoId
            ? {
                ...memo,
                text,
              }
            : memo
        )
      );
    },
    [memoList]
  );

  const placeOnTop = useCallback(
    (memoId) => {
      // 해당 메모를 최상단으로 배치 (z-index 최대)
      setMemoList(
        memoList.map((memo) =>
          memo.id === memoId
            ? {
                ...memo,
                zIndex: Math.max(...memoList.map((memo) => memo.zIndex)) + 1,
              }
            : memo
        )
      );
    },
    [memoList]
  );

  const moveMemo = (mouseEvent) => {
    // 해당 메모의 위치 변경
    setMemoList(
      memoList.map((memo) =>
        memo.id === dragMoveState.targetDragMemoId
          ? {
              ...memo,
              left: mouseEvent.pageX - dragMoveState.mouseOffsetX,
              top: mouseEvent.pageY - dragMoveState.mouseOffsetY,
            }
          : memo
      )
    );
  };

  const changeDragMoveState = useCallback((memoId, mouseEvent) => {
    // 메모 이동 목적의 드래그 상태 설정
    setDragMoveState({
      isDragging: true,
      targetDragMemoId: memoId,
      mouseOffsetX: mouseEvent.nativeEvent.offsetX,
      mouseOffsetY: mouseEvent.nativeEvent.offsetY,
    });
  }, []);

  const resetDragMoveState = () => {
    // 메모 이동 목적의 드래그 상태 초기화
    setDragMoveState({
      isDragging: false,
      targetDragMemoId: '',
      mouseOffsetX: 0,
      mouseOffsetY: 0,
    });
  };

  const closeMemo = useCallback(
    (memoId) => {
      // 해당 메모 제거
      setMemoList(memoList.filter((memo) => memo.id !== memoId));
    },
    [memoList]
  );

  console.log('render App Component');

  return (
    <div
      className="wrap"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {memoList.map((memo) => (
        <Memo
          key={memo.id}
          memo={memo}
          onMemoTextChange={changeText}
          placeOnTop={placeOnTop}
          changeDragMoveState={changeDragMoveState}
          closeMemo={closeMemo}
        />
      ))}
    </div>
  );
}

export default App;
