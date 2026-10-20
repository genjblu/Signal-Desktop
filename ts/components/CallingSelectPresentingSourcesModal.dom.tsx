// Copyright 2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { useState, type JSX } from 'react';
import classNames from 'classnames';
import lodash from 'lodash';
import { Button, ButtonVariant } from './Button.dom.tsx';
import type { LocalizerType } from '../types/Util.std.ts';
import { Modal } from './Modal.dom.tsx';
import type {
  PresentedSource,
  PresentableSource,
} from '../types/Calling.std.ts';
import { Theme } from '../util/theme.std.ts';
import { strictAssert } from '../util/assert.std.ts';
import {
  loadScreenShareSettings,
  saveScreenShareSettings,
} from '../calling/screenShareSettings.std.ts';

const { groupBy } = lodash;

export type PropsType = {
  i18n: LocalizerType;
  presentingSourcesAvailable: ReadonlyArray<PresentableSource>;
  selectPresentingSource: (id: string) => void;
  cancelPresenting: () => void;
};

function Source({
  onSourceClick,
  source,
  sourceToPresent,
}: {
  onSourceClick: (source: PresentedSource) => void;
  source: PresentableSource;
  sourceToPresent?: PresentedSource;
}): JSX.Element {
  return (
    <button
      className={classNames({
        'module-CallingSelectPresentingSourcesModal__source': true,
        'module-CallingSelectPresentingSourcesModal__source--selected':
          sourceToPresent?.id === source.id,
      })}
      key={source.id}
      onClick={() => {
        onSourceClick({
          id: source.id,
          name: source.name,
        });
      }}
      type="button"
    >
      <img alt={source.name} src={source.thumbnail} />
      <div className="module-CallingSelectPresentingSourcesModal__name--container">
        {source.appIcon ? (
          <img
            alt={source.name}
            className="module-CallingSelectPresentingSourcesModal__name--icon"
            height={16}
            src={source.appIcon}
            width={16}
          />
        ) : null}
        <span className="module-CallingSelectPresentingSourcesModal__name--text">
          {source.name}
        </span>
      </div>
    </button>
  );
}

export function CallingSelectPresentingSourcesModal({
  i18n,
  presentingSourcesAvailable,
  selectPresentingSource,
  cancelPresenting,
}: PropsType): JSX.Element | null {
  const [sourceToPresent, setSourceToPresent] = useState<
    PresentedSource | undefined
  >(undefined);
  const [settings, setSettings] = useState(loadScreenShareSettings);

  const updateSettings = (updates: Partial<typeof settings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    saveScreenShareSettings(updated);
  };

  if (!presentingSourcesAvailable.length) {
    throw new Error('No sources available for presenting');
  }

  const sources = groupBy(
    presentingSourcesAvailable,
    source => source.isScreen
  );

  const footer = (
    <>
      <Button onClick={cancelPresenting} variant={ButtonVariant.Secondary}>
        {i18n('icu:cancel')}
      </Button>
      <Button
        disabled={!sourceToPresent}
        onClick={() => {
          strictAssert(sourceToPresent, 'No source to present');
          selectPresentingSource(sourceToPresent.id);
        }}
      >
        {i18n('icu:calling__SelectPresentingSourcesModal--confirm')}
      </Button>
    </>
  );

  return (
    <Modal
      modalName="CallingSelectPresentingSourcesModal"
      hasXButton
      i18n={i18n}
      className="module-CallingSelectPresentingSourcesModal"
      onClose={cancelPresenting}
      theme={Theme.Dark}
      title={i18n('icu:calling__SelectPresentingSourcesModal--title')}
      modalFooter={footer}
    >
      <div className="module-CallingSelectPresentingSourcesModal__title">
        {i18n('icu:calling__SelectPresentingSourcesModal--entireScreen')}
      </div>
      <div className="module-CallingSelectPresentingSourcesModal__sources">
        {(sources.true ?? []).map(source => (
          <Source
            key={source.id}
            onSourceClick={selectedSource => setSourceToPresent(selectedSource)}
            source={source}
            sourceToPresent={sourceToPresent}
          />
        ))}
      </div>
      <div className="module-CallingSelectPresentingSourcesModal__title">
        {i18n('icu:calling__SelectPresentingSourcesModal--window')}
      </div>
      <div className="module-CallingSelectPresentingSourcesModal__sources">
        {(sources.false ?? []).map(source => (
          <Source
            key={source.id}
            onSourceClick={selectedSource => setSourceToPresent(selectedSource)}
            source={source}
            sourceToPresent={sourceToPresent}
          />
        ))}
      </div>

      <div className="module-CallingSelectPresentingSourcesModal__settings">
        <div className="module-CallingSelectPresentingSourcesModal__settings-row">
          <span className="module-CallingSelectPresentingSourcesModal__settings-label">
            Разрешение:
          </span>
          <div className="module-CallingSelectPresentingSourcesModal__button-group">
            {(
              [
                { id: '480p', label: '480p' },
                { id: '720p', label: '720p (HD)' },
                { id: '1080p', label: '1080p (FHD)' },
                { id: 'source', label: 'Исходное' },
              ] as const
            ).map(opt => (
              <button
                type="button"
                key={opt.id}
                className={classNames(
                  'module-CallingSelectPresentingSourcesModal__pill',
                  {
                    'module-CallingSelectPresentingSourcesModal__pill--active':
                      settings.resolution === opt.id,
                  }
                )}
                onClick={() => updateSettings({ resolution: opt.id })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="module-CallingSelectPresentingSourcesModal__settings-row">
          <span className="module-CallingSelectPresentingSourcesModal__settings-label">
            Частота кадров:
          </span>
          <div className="module-CallingSelectPresentingSourcesModal__button-group">
            {([15, 30, 60] as const).map(fps => (
              <button
                type="button"
                key={fps}
                className={classNames(
                  'module-CallingSelectPresentingSourcesModal__pill',
                  {
                    'module-CallingSelectPresentingSourcesModal__pill--active':
                      settings.framerate === fps,
                  }
                )}
                onClick={() => updateSettings({ framerate: fps })}
              >
                {fps} FPS
              </button>
            ))}
          </div>
        </div>

        <div className="module-CallingSelectPresentingSourcesModal__settings-row">
          <span className="module-CallingSelectPresentingSourcesModal__settings-label">
            Приоритет:
          </span>
          <div className="module-CallingSelectPresentingSourcesModal__button-group">
            <button
              type="button"
              className={classNames(
                'module-CallingSelectPresentingSourcesModal__pill',
                {
                  'module-CallingSelectPresentingSourcesModal__pill--active':
                    settings.mode === 'motion',
                }
              )}
              onClick={() => updateSettings({ mode: 'motion' })}
            >
              Плавность (видео / игры)
            </button>
            <button
              type="button"
              className={classNames(
                'module-CallingSelectPresentingSourcesModal__pill',
                {
                  'module-CallingSelectPresentingSourcesModal__pill--active':
                    settings.mode === 'detail',
                }
              )}
              onClick={() => updateSettings({ mode: 'detail' })}
            >
              Четкость текста
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
