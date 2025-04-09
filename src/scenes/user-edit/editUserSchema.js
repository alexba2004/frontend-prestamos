import * as yup from 'yup';
import { userTypeOptions, userStatusOptions } from '../../services/Titles';
const editUserSchema = yup.object().shape({
  first_name: yup.string().required('El nombre es obligatorio'),
  last_name: yup.string().required('El apellido paterno es obligatorio'),
  middle_name: yup.string(),
  user_type: yup
    .string()
    .oneOf(
      userTypeOptions.map((option) => option.value),
      'Tipo de usuario inválido'
    )
    .required('El tipo de usuario es obligatorio'),
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, 'Solo números')
    .min(10, 'Mínimo 10 dígitos'),
  status: yup
    .string()
    .oneOf(
      userStatusOptions.map((option) => option.value),
      'Estado inválido'
    )
    .required('El estado es obligatorio'),
});

export default editUserSchema;
