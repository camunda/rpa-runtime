> [!Info]
> This repository is still a work in progress

# @camunda/rpa-integration

UI components for Editing and testing RPA files within Camunda.

## Installation

```
npm install @camunda/rpa-integration
```

## Usage

### RPA Editor

The Linrary exports `RPAEditor`. This is the main entry point and creates a monaco
editor for RPA files along with a properties panel for metdata in the given container.

The Editor also handles the state for additional UI components. You can add a `workerConfig`
to define which RPA worker instance should be used for testing.

```js
import { RPAEditor } from '@camunda/rpa-integration';


const editor = RPACodeEditor({
  container: editorContainer,
  propertiesPanel: {
    container: propertiesContainer
  },
  workerConfig: {
    host: 'localhost',
    port: 36227
  },
  value: `{}`
});
```

The editor exposes an eventBus. You can listen to edits or configuration changes. 
The following events are exposed 
 - `model.changed`: The file was changed
 - `config.changed`: The Runtime config was changed
 - `dialog.run.open`: Open the run Dialog (see Testing and Configuration UI)
 - `dialog.config.open`: Open the configuration Dialog (see Testing and Configuration UI)


### Testing and Runner Configuration UI

Additionally, the editor exposes React Components you can use to render debugging UI. They
expect an `editor` instance as prop.

Dialogs expect to be rendered in a container and have an additional `onSubmit` callback. This 
is used when the form is submitted. You can use this callback to close a modal or similar element.


Example:
```JS
import React, { useEffect, useRef, useState } from 'react';

import { RunDialog } from '@camunda/rpa-integration';

function TestButton(props) {
  const editor = props.editor;
  const eventBus = editor.eventBus;

  const [ isOpen, setIsOpen ] = useState(false);
  const buttonRef = useRef();

  useEffect(() => {
    const cb = () => {
      setIsOpen(true);
    };

    eventBus.on('dialog.run.open', cb);

    return () => {
      eventBus.off('dialog.run.open', cb);
    };
  }, [ eventBus ]);

  const onClose = () => {
    setIsOpen(false);
  };

  return <>
    <button
      ref={ buttonRef }
      onClick={ () => setIsOpen(!isOpen) }
    >
      Test RPA Script
    </button>

    { isOpen &&
        <div style={ { padding: '12px' } }>
          <RunDialog
            editor={ editor }
            onSubmit={ onClose }
          />
        </div>
    }
  </>;
}
```