"use client";

import { useState } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, useClick, useDismiss, useInteractions } from '@floating-ui/react';
import type { StatusOption } from '../lib/mockData';
import { STATUS_OPTIONS } from '../lib/mockData';
import style from './status-selector.module.css';

interface StatusSelectorProps {
  currentStatus: StatusOption;
  onStatusChange?: (status: StatusOption) => void;
}

export function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 })
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const handleStatusSelect = (status: StatusOption) => {
    onStatusChange?.(status);
    setIsOpen(false);
  };

  return (
    <>
      <div
        ref={refs.setReference}
        className={style.statusEmojiBtn}
        {...getReferenceProps()}
      >
        <span className={style.currentStatusEmoji}>{currentStatus.emoji}</span>
      </div>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={style.statusEmojiMenu}
          {...getFloatingProps()}
        >
          {STATUS_OPTIONS.map((status, index) => (
            <div
              key={index}
              className={style.statusOption}
              onClick={() => handleStatusSelect(status)}
            >
              <span className={style.statusEmoji}>{status.emoji}</span>
              <span className={style.statusText}>{status.text}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}