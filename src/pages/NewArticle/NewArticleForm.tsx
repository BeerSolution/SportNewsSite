import { Form, Formik } from 'formik';

import { useFileUploadMutation } from 'api/fileUploadApi';
import { ImageUpload, Input, MarkdownForm, Select } from 'components';
import { articleSchema } from 'features/newArticle/validationSchema';

import type { IImageFormik, INewArticleForm } from 'pages/NewArticle/types';

import './NewArticle.scss';

const ImageFormik = ({ formikSetValue, touched, errors, value, name }: IImageFormik) => {
  const [uploadFile, { isLoading }] = useFileUploadMutation();

  const handleChangeImage = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const imageHref = await uploadFile(formData).unwrap();

      if (imageHref) formikSetValue(name, imageHref.path);
    }
  };

  return (
    <ImageUpload
      touched={touched}
      errors={errors}
      onChange={handleChangeImage}
      onDrop={handleChangeImage}
      href={value}
      isLoading={isLoading}
    />
  );
};

const NewArticleForm = ({
  onSubmit,
  initialValues,
  submitAction,
  submitRef,
  reviewRef,
}: INewArticleForm) => {
  return (
    <Formik validationSchema={articleSchema} onSubmit={onSubmit} initialValues={initialValues}>
      {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
        <Form>
          <ImageFormik
            touched={touched.img}
            errors={errors.img}
            formikSetValue={setFieldValue}
            name='img'
            value={values.img}
          />
          <div className='create-article-form-select'>
            <Select
              defaultValue={values.conference}
              touched={touched.conference}
              errors={errors.conference}
              disabled
              placeholder='Not Selected'
              label='Conference'
              options={['blabla', 'bebebe', 'kwawa', 'lklklk']}
              name='conference'
              className='create-article-form-select-item'
              formikSetValue={setFieldValue}
            />
            <Select
              defaultValue={values.team}
              touched={touched.team}
              errors={errors.team}
              placeholder='Not Selected'
              label='Team'
              options={['blabla', 'bebebe', 'kwawa', 'lklklk']}
              name='team'
              className='create-article-form-select-item'
              formikSetValue={setFieldValue}
            />
            <Select
              defaultValue={values.location}
              touched={touched.location}
              errors={errors.location}
              placeholder='Not Selected'
              label='Location'
              options={['blabla', 'bebebe', 'kwawa', 'lklklk']}
              name='location'
              className='create-article-form-select-item'
              formikSetValue={setFieldValue}
            />
          </div>
          <Input
            touched={touched.alt}
            errors={errors.alt}
            value={values.alt}
            type='text'
            name='alt'
            label='alt'
            onChange={handleChange}
            placeholder='Alternative text for picture'
            className='create-article-form-input'
          />
          <Input
            touched={touched.title}
            errors={errors.title}
            value={values.title}
            type='text'
            name='title'
            label='Article Headline'
            onChange={handleChange}
            className='create-article-form-input'
            placeholder='Name'
          />
          <MarkdownForm
            touched={touched.content}
            errors={errors.content}
            label='Content'
            value={values.content}
            name='content'
          />
          <button
            type='submit'
            ref={submitRef}
            onClick={() => {
              submitAction('submit');
              handleSubmit();
            }}
          >
            submit
          </button>
          <button
            hidden
            type='submit'
            ref={reviewRef}
            onClick={() => {
              submitAction('preview');
              handleSubmit();
            }}
          >
            preview
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default NewArticleForm;
