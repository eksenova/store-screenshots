"use client";

import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Slider } from "@/components/ui/Slider";
import { NumberInput } from "@/components/ui/NumberInput";
import { Toggle } from "@/components/ui/Toggle";
import { ColorPicker } from "@/components/ui/ColorPicker";
import type { Shadow } from "@/lib/types";

export function TransformPanel() {
  const { selectedLayer, setTransform2D, setTransform3D, dispatch, activePanel } = useEditor();

  if (!selectedLayer) {
    return (
      <CollapsibleSection title="Transform">
        <p className="text-xs text-gray-400">Select a layer to transform</p>
      </CollapsibleSection>
    );
  }

  const t2d = selectedLayer.transform2d;
  const t3d = selectedLayer.transform3d;
  const has3D = t3d !== null;
  const isUniformScale = Math.abs(t2d.scaleX - t2d.scaleY) < 0.001;

  const update2D = (changes: Partial<typeof t2d>) => setTransform2D(selectedLayer.id, changes);

  const toggle3D = (enabled: boolean) => {
    setTransform3D(
      selectedLayer.id,
      enabled ? { perspective: 1000, rotateX: 0, rotateY: 0, rotateZ: 0 } : null,
    );
  };

  const update3D = (changes: Partial<NonNullable<typeof t3d>>) => {
    if (!t3d) return;
    setTransform3D(selectedLayer.id, { ...t3d, ...changes });
  };

  const updateShadow = (changes: Partial<Shadow>) => {
    dispatch({
      type: "UPDATE_LAYER",
      panelId: activePanel.id,
      layerId: selectedLayer.id,
      changes: { shadow: { ...selectedLayer.shadow, ...changes } },
    });
  };

  const updateOpacity = (opacity: number) => {
    dispatch({
      type: "SET_OPACITY",
      panelId: activePanel.id,
      layerId: selectedLayer.id,
      opacity,
    });
  };

  return (
    <CollapsibleSection title="Transform">
      {/* Selected layer info */}
      <div className="text-[10px] text-indigo-600 bg-indigo-50 rounded px-2 py-1 mb-1">
        Editing: {selectedLayer.name}
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <NumberInput label="X" value={Math.round(t2d.x)} onChange={(x) => update2D({ x })} />
        <NumberInput label="Y" value={Math.round(t2d.y)} onChange={(y) => update2D({ y })} />
      </div>

      {/* Uniform Scale */}
      <Slider
        label="Scale"
        value={t2d.scaleX}
        min={0.05}
        max={2}
        step={0.01}
        onChange={(s) => update2D({ scaleX: s, scaleY: s })}
      />

      {/* Non-uniform scale toggle */}
      <Toggle
        label="Non-uniform scale"
        checked={!isUniformScale}
        onChange={(checked) => {
          if (!checked) {
            update2D({ scaleY: t2d.scaleX });
          }
        }}
      />
      {!isUniformScale && (
        <div className="grid grid-cols-2 gap-2 pl-2 border-l-2 border-gray-200">
          <Slider label="Scale X" value={t2d.scaleX} min={0.05} max={2} step={0.01}
            onChange={(scaleX) => update2D({ scaleX })} />
          <Slider label="Scale Y" value={t2d.scaleY} min={0.05} max={2} step={0.01}
            onChange={(scaleY) => update2D({ scaleY })} />
        </div>
      )}

      {/* 2D Rotation */}
      <Slider label="Rotation" value={t2d.rotation} min={-180} max={180} unit="°"
        onChange={(rotation) => update2D({ rotation })} />

      {/* Opacity */}
      <Slider label="Opacity" value={selectedLayer.opacity} min={0} max={1} step={0.01}
        onChange={updateOpacity} />

      {/* 3D Transform */}
      <Toggle label="3D Transform" checked={has3D} onChange={toggle3D} />
      {has3D && t3d && (
        <div className="space-y-2 pl-2 border-l-2 border-indigo-200">
          <Slider label="Perspective" value={t3d.perspective} min={100} max={3000} unit="px"
            onChange={(perspective) => update3D({ perspective })} />
          <Slider label="Rotate X" value={t3d.rotateX} min={-90} max={90} unit="°"
            onChange={(rotateX) => update3D({ rotateX })} />
          <Slider label="Rotate Y" value={t3d.rotateY} min={-90} max={90} unit="°"
            onChange={(rotateY) => update3D({ rotateY })} />
          <Slider label="Rotate Z" value={t3d.rotateZ} min={-180} max={180} unit="°"
            onChange={(rotateZ) => update3D({ rotateZ })} />
        </div>
      )}

      {/* Shadow */}
      <Toggle label="Drop shadow" checked={selectedLayer.shadow.enabled}
        onChange={(enabled) => updateShadow({ enabled })} />
      {selectedLayer.shadow.enabled && (
        <div className="space-y-2 pl-2 border-l-2 border-purple-200">
          <ColorPicker label="Color" value={selectedLayer.shadow.color}
            onChange={(color) => updateShadow({ color })} />
          <Slider label="Offset X" value={selectedLayer.shadow.offsetX} min={-50} max={50} unit="px"
            onChange={(offsetX) => updateShadow({ offsetX })} />
          <Slider label="Offset Y" value={selectedLayer.shadow.offsetY} min={-50} max={50} unit="px"
            onChange={(offsetY) => updateShadow({ offsetY })} />
          <Slider label="Blur" value={selectedLayer.shadow.blur} min={0} max={100} unit="px"
            onChange={(blur) => updateShadow({ blur })} />
        </div>
      )}
    </CollapsibleSection>
  );
}
