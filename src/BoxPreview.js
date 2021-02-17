import { useEffect, useRef } from 'react';
import './BoxPreview.scss';
import PseudoStyler from './pseudostyler';
import fastCartesian from 'fast-cartesian';

const BoxPreview = function BoxPreview() {
  let buttonRefs = useRef([]);
  const pseudoClasses = [':hover', ':active', ':focus'];
  const combinations = fastCartesian(pseudoClasses.map((_) => [true, false]));
  const buttons = combinations.map((combArray, i) => (
    <button ref={(el) => buttonRefs.current.push(el)} key={i}>
      {`hover:\t${combArray[0]}\nactive:\t${combArray[1]}\nfocus:\t${combArray[2]}`}
    </button>
  ));

  useEffect(() => {
    console.log('useEffect');
    console.log('buttonRefs.current:', buttonRefs.current);
    (async function togglePseudoStyles() {
      const styler = new PseudoStyler();
      await styler.loadDocumentStyles();

      buttonRefs.current.forEach((buttonRef, buttonIndex) => {
        const pseudoClassValues = combinations[buttonIndex];
        pseudoClassValues.forEach((isClassActive, classIndex) => {
          if (isClassActive) {
            styler.toggleStyle(buttonRef, pseudoClasses[classIndex]);
          }
        });
      });
    })();
    return () => (buttonRefs.current = []);
  });

  return <div id="button-container">{buttons}</div>;
};

export default BoxPreview;
