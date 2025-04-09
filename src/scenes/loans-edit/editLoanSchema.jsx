import * as yup from 'yup';
import { loanStatusOptions } from '../../services/Titles';

export const validationSchema = yup.object().shape({
  user_id: yup.string().required('El usuario es obligatorio'),
  material_id: yup.string().required('El material es obligatorio'),
  return_date: yup
    .date()
    .min(
      new Date(Date.now() + 24 * 60 * 60 * 1000),
      'La fecha de devolución no puede ser menor a mañana'
    )
    .required('La fecha de devolución es obligatoria'),
  loan_status: yup
    .string()
    .oneOf(
      loanStatusOptions.map((option) => option.value),
      'Estado inválido'
    )
    .required('El estado es obligatorio'),
});
