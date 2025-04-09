import * as yup from 'yup';
import { materialStatusOptions } from '../../services/Titles';

export const validationSchema = yup.object().shape({
  material_type: yup.string().required('El tipo de material es obligatorio'),
  brand: yup.string().required('La marca es obligatoria'),
  model: yup.string().required('El modelo es obligatorio'),
  status: yup
    .string()
    .oneOf(
      materialStatusOptions.map((option) => option.value),
      'Estado inválido'
    )
    .required('El estado es obligatorio'),
});