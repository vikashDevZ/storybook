import React from 'react';
import { ModalTrigger } from '../../components/modal';
import Link from '../../components/link';
//import './styles.scss';

/**
 * @description Long Text Component
 * @type component
 * @author Inderdeep
 */
const Main = (props) => {

  const { text, title, limit } = props;

  return (
    <div>
      <p>{(text || '').slice(0, limit || 25)}</p>
      {(text || '').length > (limit || 25) && (
        <ModalTrigger
          modalProps={{
            title: title || 'Message',
            footer: null,
          }}
          content={
            <div>
              <span>{text || ''}</span>
              <span>...</span>
            </div>
          }
        >
          <Link>Read More</Link>
        </ModalTrigger>
      )}
    </div>
  );

}

export default Main;