import React, { useEffect } from 'react';
import * as ClientOAuth2 from 'client-oauth2';

export async function openSocialLoginWindow(data) {
  if (data) {
    return new Promise((resolve, reject) => {
      try {
        const oAuth2Client = new ClientOAuth2({
          ...data,
        });
        const uri = oAuth2Client.token.getUri();
        const childWindow = window.open(
          uri,
          data.type,
          'width=500, height=500'
        );
        const onClose = () => {
          reject({
            error: 'Window is closed.',
            hideMessage: true,
          });
        };
        const interval = window.setInterval(() => {
          if (childWindow && childWindow.closed) {
            clearInterval(interval);
            onClose();
          }
        }, 500);
        window.oAuth2Instance = oAuth2Client;
        window.oAuth2Provider = data.type;
        window.oAuth2Callback = async (response) => {
          clearInterval(interval);
          childWindow.close();
          response = await oAuth2Client.token.getToken(response);
          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }
        };
      } catch (e) {
        reject({
          error: e,
        });
      }
    });
  } else {
    console.error(`Client Auth Obj not initialized for Social Sign In`);
    throw `Client Auth Obj not initialized for Social Sign In.`;
  }
}

/**
 * @description Social SignIn Component
 * @type Component
 * @author
 */
export const SocialSignIn = ({
  children,
  config,
  onError,
  onSuccess,
  ContainerElement,
  ...props
}) => {
  ContainerElement =
    ContainerElement ||
    (({ children: children2, ...prop2 }) => (
      <span {...prop2}>{children2}</span>
    ));
  return (
    <ContainerElement
      {...props}
      onClick={async (e) => {
        try {
          const response = await openSocialLoginWindow(config);
          onSuccess instanceof Function && onSuccess(response);
        } catch (e) {
          console.error(e);
          onError instanceof Function && onError(e);
        }
        if (props.onClick instanceof Function) {
          props.onClick(e);
        }
      }}
    >
      {children}
    </ContainerElement>
  );
};

/**
 * @description OnAuth2Callback Page
 * @type Component
 * @author Inderdeep
 */
export const OAuth2CallbackPage = ({}) => {
  useEffect(() => {
    if (window.opener && window.opener.oAuth2Callback) {
      window.opener.oAuth2Callback(window.location.href);
    } else {
      alert('No callback defined in parent page');
      window.close();
    }
  }, []);
  return null;
};
