import { useEffect, useCallback, useRef } from 'react';
import './BoxPreview.scss';
import PseudoStyler from './pseudostyler';

const BoxPreview = function BoxPreview() {
  const hoverRef = useRef(null);
  const activeRef = useRef(null);
  const focusRef = useRef(null);
  useEffect(() => {
    (async function togglePseudoStyles() {
      const styler = new PseudoStyler();
      await styler.loadDocumentStyles();

      styler.toggleStyle(hoverRef.current, ':hover');
      styler.toggleStyle(activeRef.current, ':active');
      styler.toggleStyle(focusRef.current, ':focus');
    })();
  });

  const handleClick = useCallback(() => {
    console.log('click');
  }, []);

  return (
    <div id="button-container">
      <button onClick={handleClick}>box</button>
      <button ref={hoverRef} onClick={handleClick}>
        box
      </button>
      <button ref={activeRef} onClick={handleClick}>
        box
      </button>
      <button ref={focusRef} onClick={handleClick}>
        box
      </button>
    </div>
  );
};

export default BoxPreview;
