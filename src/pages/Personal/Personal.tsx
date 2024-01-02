import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useUpdateUserMutation } from 'api/authApi';
import { useFileUploadMutation } from 'api/fileUploadApi';
import { Modal } from 'components';
import { ModalVariant } from 'components/Modal/enums';
import { changePassword, personal } from 'constants/routesPath';
import PasswordForm from 'pages/Personal/PasswordForm';
import PersonalForm from 'pages/Personal/PersonalForm';
import { selectCurrentUser } from 'redux/authSlice';

import type { IRequestError } from 'features/auth/types';
import type { PersonalDataType } from 'pages/Personal/types';

import './Personal.scss';

const Personal = () => {
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<{ title: string; message: string }>();
  const [formVariant, setFormVariant] = useState<'personal' | 'password'>('personal');

  const [updateUser, { isError: isUserError, error: userError }] = useUpdateUserMutation();
  const [uploadFile, { isError: isImageError, error: imageError }] = useFileUploadMutation();
  const user = useSelector(selectCurrentUser);

  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === personal) setFormVariant('personal');
    if (pathname === changePassword) setFormVariant('password');
  }, [pathname]);

  useEffect(() => {
    if (imageError) {
      const error = (imageError as IRequestError).data?.message;
      setModalMessage({ title: 'ERROR', message: error });
      setShowModal(true);
    }
    if (userError) {
      const error = (userError as IRequestError).data?.message;
      setModalMessage({ title: 'ERROR', message: error });
      setShowModal(true);
    }
  }, [isUserError, isImageError]);

  const getAvatarImage = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const imageHref = await uploadFile(formData).unwrap();

      if (imageHref) {
        updateUser({ avatar: imageHref.path });
        setAvatar(imageHref.path);
      }
    }
  };

  const handleSubmitForm = async (values: PersonalDataType) => {
    const nonEmptyValues = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== ''),
    );

    if (Object.keys(nonEmptyValues).length) {
      const updatedUser = await updateUser(nonEmptyValues).unwrap();

      if (updatedUser) {
        setShowModal(true);
        setModalMessage({ title: 'Success', message: 'The user was updated successfully' });
      }
    }
  };

  const passwordVariant = formVariant === 'password';
  const personalVariant = formVariant === 'personal';

  return (
    <div className='personal'>
      <Modal
        variant={ModalVariant.Custom}
        customText={modalMessage}
        show={showModal}
        handleShow={setShowModal}
      />
      <div className='personal-contain'>
        <div className='personal-btn'>
          <button
            onClick={() => setFormVariant('personal')}
            className={`personal-btn-item ${personalVariant ? 'active' : ''}`}
          >
            Personal
          </button>
          <button
            onClick={() => setFormVariant('password')}
            className={`personal-btn-item ${passwordVariant ? 'active' : ''}`}
          >
            Change password
          </button>
        </div>
        {personalVariant && (
          <PersonalForm
            user={user}
            avatarOnChange={getAvatarImage}
            handleSubmitForm={handleSubmitForm}
            avatar={avatar}
          />
        )}
        {passwordVariant && <PasswordForm handleSubmitForm={handleSubmitForm} />}
      </div>
    </div>
  );
};

export default Personal;
