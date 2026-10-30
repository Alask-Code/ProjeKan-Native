import React, { useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, View } from "react-native";
import { Project, ProjectStatus } from "../stores/nativeProjectStore";
import { columns } from "../constants/app";

export function useBoardDrag(projects: Project[], onMoveToPosition: (id: number, status: ProjectStatus, index: number) => void) {
  const rootRef = useRef<React.ComponentRef<typeof View>>(null);
  const boardRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const boardWindowX = useRef(0);
  const boardScrollX = useRef(0);
  const edgeScrollDirection = useRef(0);
  const edgeScrollFrame = useRef<number | null>(null);
  const edgeDragPoint = useRef<{ projectId: number; pageX: number; pageY: number } | null>(null);
  const columnBounds = useRef<Record<string, { x: number; width: number }>>({});
  const columnViewports = useRef<Record<string, { y: number; scrollY: number }>>({});
  const rootWindow = useRef({ x: 0, y: 0 });
  const dragGrabOffset = useRef({ x: 0, y: 0 });
  const cardBounds = useRef<Record<string, Record<number, { y: number; height: number; width: number }>>>({});
  const dragPosition = useRef(new Animated.ValueXY()).current;
  const dragLiftProgress = useRef(new Animated.Value(0)).current;
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [settlingId, setSettlingId] = useState<number | null>(null);
  const [dragSize, setDragSize] = useState<{ width: number; height: number } | null>(null);
  const [dropPreview, setDropPreview] = useState<{ id: number; status: ProjectStatus; index: number; width: number; height: number } | null>(null);
  const dropPreviewRef = useRef(dropPreview);
  dropPreviewRef.current = dropPreview;
  const stopEdgeScroll = () => {
    edgeScrollDirection.current = 0;
    if (edgeScrollFrame.current !== null) cancelAnimationFrame(edgeScrollFrame.current);
    edgeScrollFrame.current = null;
  };
  const runEdgeScroll = () => {
    if (edgeScrollFrame.current !== null || !edgeScrollDirection.current) return;
    const step = () => {
      const direction = edgeScrollDirection.current;
      if (!direction) { edgeScrollFrame.current = null; return; }
      const nextX = Math.max(0, boardScrollX.current + direction * 12);
      boardScrollX.current = nextX;
      boardRef.current?.scrollTo({ x: nextX, animated: false });
      const point = edgeDragPoint.current;
      if (point) {
        const next = findDropPreview(point.projectId, point.pageX, point.pageY);
        const current = dropPreviewRef.current;
        if (next?.status !== current?.status || next?.index !== current?.index) {
          dropPreviewRef.current = next;
          setDropPreview(next);
        }
      }
      edgeScrollFrame.current = requestAnimationFrame(step);
    };
    edgeScrollFrame.current = requestAnimationFrame(step);
  };
  const registerColumn = (status: ProjectStatus, x: number, width: number) => { columnBounds.current[status] = { x, width }; };
  const registerViewport = (status: ProjectStatus, y: number) => { columnViewports.current[status] = { y, scrollY: columnViewports.current[status]?.scrollY ?? 0 }; };
  const registerCard = (status: ProjectStatus, id: number, y: number, height: number, width: number) => { cardBounds.current[status] = { ...cardBounds.current[status], [id]: { y, height, width } }; };
  const findDropPreview = (projectId: number, pageX: number, pageY: number) => {
    const contentX = pageX - boardWindowX.current + boardScrollX.current;
    const target = columns.find((column) => { const bounds = columnBounds.current[column.key]; return bounds && contentX >= bounds.x && contentX <= bounds.x + bounds.width; });
    if (!target) return null;
    const viewport = columnViewports.current[target.key] ?? { y: 0, scrollY: 0 };
    const contentY = pageY - viewport.y + viewport.scrollY;
    const targetProjects = projects.filter((project) => project.id !== projectId && (project.status ?? "unstarted") === target.key)
      .sort((a, b) => (a.sortOrder ?? projects.findIndex((project) => project.id === a.id)) - (b.sortOrder ?? projects.findIndex((project) => project.id === b.id)));
    const bounds = cardBounds.current[target.key] ?? {};
    const targetIndex = targetProjects.findIndex((project) => { const card = bounds[project.id]; return card ? contentY < card.y + card.height / 2 : false; });
    const draggedBounds = Object.values(cardBounds.current).map((items) => items[projectId]).find(Boolean);
    const index = targetIndex < 0 ? targetProjects.length : targetIndex;
    return { id: projectId, status: target.key, index, width: draggedBounds?.width ?? 250, height: draggedBounds?.height ?? 112 };
  };
  const startDrag = (projectId: number, pageX: number, pageY: number, localX: number, localY: number) => {
    const draggedBounds = Object.values(cardBounds.current).map((items) => items[projectId]).find(Boolean);
    if (!draggedBounds) return;
    dragGrabOffset.current = { x: localX, y: localY };
    setSettlingId(null);
    dragPosition.setValue({ x: pageX - rootWindow.current.x - localX, y: pageY - rootWindow.current.y - localY });
    dragLiftProgress.setValue(0);
    Animated.spring(dragLiftProgress, { toValue: 1, useNativeDriver: true, stiffness: 300, damping: 22, mass: 0.7 }).start();
    setDraggingId(projectId);
    setDragSize({ width: draggedBounds.width, height: draggedBounds.height });
    const initialPreview = findDropPreview(projectId, pageX, pageY);
    dropPreviewRef.current = initialPreview;
    setDropPreview(initialPreview);
  };
  const updateDrag = (projectId: number, pageX: number, pageY: number, localX: number, localY: number) => {
    edgeDragPoint.current = { projectId, pageX, pageY };
    dragPosition.setValue({ x: pageX - rootWindow.current.x - dragGrabOffset.current.x, y: pageY - rootWindow.current.y - dragGrabOffset.current.y });
    const edgeSize = 56;
    const screenWidth = Dimensions.get("window").width;
    edgeScrollDirection.current = pageX < edgeSize ? -1 : pageX > screenWidth - edgeSize ? 1 : 0;
    if (edgeScrollDirection.current) runEdgeScroll();
    else stopEdgeScroll();
    const next = findDropPreview(projectId, pageX, pageY);
    const current = dropPreviewRef.current;
    if (next?.status !== current?.status || next?.index !== current?.index) {
      dropPreviewRef.current = next;
      setDropPreview(next);
    }
  };
  const finishDrag = (projectId: number, pageX: number, pageY: number) => {
    stopEdgeScroll();
    edgeDragPoint.current = null;
    const target = findDropPreview(projectId, pageX, pageY);
    if (!target) { cancelDrag(); return; }
    dropPreviewRef.current = target;
    setDropPreview(target);
    setIsDropping(true);
    onMoveToPosition(projectId, target.status, target.index);
    dragPosition.stopAnimation();
    // Keep the drop slot visible until the reordered list has rendered, then
    // replace the floating preview with the real card at that same index.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setDraggingId(null);
      setIsDropping(false);
      setSettlingId(projectId);
      setDragSize(null);
      dropPreviewRef.current = null;
      setDropPreview(null);
      setTimeout(() => setSettlingId((current) => current === projectId ? null : current), 220);
    }));
  };
  const cancelDrag = () => { stopEdgeScroll(); edgeDragPoint.current = null; setDraggingId(null); setIsDropping(false); setDragSize(null); dropPreviewRef.current = null; setDropPreview(null); dragPosition.stopAnimation(); dragPosition.setValue({ x: 0, y: 0 }); };
  const draggedProject = projects.find((project) => project.id === draggingId);
  return { rootRef, boardRef, dragPosition, dragLiftProgress, draggingId, isDropping, settlingId, dragSize, dropPreview, stopEdgeScroll, registerColumn, registerViewport, registerCard, findDropPreview, startDrag, updateDrag, finishDrag, cancelDrag, draggedProject, rootWindow, boardWindowX, boardScrollX, columnViewports };
}
