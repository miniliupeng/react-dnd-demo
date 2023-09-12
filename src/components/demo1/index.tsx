// 使用 useDrag 处理拖拽的元素，使用 useDrop 处理 drop 的元素，使用 useDragLayer 处理自定义预览元素
// 在根组件使用 DndProvider 设置 context 来传递数据
// useDrag 可以传入 type、item、collect 等。type 标识类型，同类型才可以 drop。item 是传递的数据。collect 接收 monitor，可以取拖拽的状态比如  isDragging 返回。
// useDrag 返回三个值，第一个值是 collect 函数返回值，第二个是处理 drag 的元素的函数，第三个值是处理预览元素的函数
// useDrop 可以传入 accept、drop 等。accept 是可以 drop 的类型。drop 回调函数可以拿到 item，也就是 drag 元素的数据
// useDragLayer 的回调函数会传入 monitor，可以拿到拖拽的实时坐标，用来设置自定义预览效果

import { useEffect, useRef, useState } from "react";
import "./index.css";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
interface ItemType {
  color: string;
}

interface BoxProps {
  color: string;
}

// 预览的样式
const DragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging) {
    return null;
  }
  return (
    <div
      className="drag-layer"
      style={{
        left: currentOffset?.x,
        top: currentOffset?.y,
      }}
    >
      {item.color} 拖拖拖
    </div>
  );
};

function Box(props: BoxProps) {
  const ref = useRef(null);
  // 第三个返回值 处理拖拽过程的预览元素
  const [{ dragging }, drag, dragPreview] = useDrag({
    type: "box",
    item: {
      color: props.color,
    },
    collect(monitor) {
      // 拖拽触发
      // monitor 拖拽过程中的状态
      return {
        dragging: monitor.isDragging(),
      };
    },
  });
  useEffect(() => {
    drag(ref);
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div
      ref={ref}
      className={dragging ? "box dragging" : "box"}
      style={{ backgroundColor: props.color }}
    ></div>
  );
}

function Container() {
  const [boxes, setBoxes] = useState<ItemType[]>([]);
  const ref = useRef(null);

  const [, drop] = useDrop(() => {
    return {
      accept: "box", // 需对应
      drop(item: ItemType) {
        setBoxes((boxes) => [...boxes, item]);
      },
    };
  });
  useEffect(() => {
    drop(ref);
  }, []);

  return (
    <div ref={ref} className="container">
      {boxes.map((item) => {
        return <Box color={item.color}></Box>;
      })}
    </div>
  );
}

function App() {
  return (
    <div>
      <Container></Container>
      <Box color="blue"></Box>
      <Box color="red"></Box>
      <Box color="green"></Box>
      <DragLayer />
    </div>
  );
}

export default App;
