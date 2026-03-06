interface FormFieldLabelProps {
  label: string
  htmlFor: string
  required?: boolean
}

const FormFieldLabel = ({
  label,
  htmlFor,
  required = true,
}: FormFieldLabelProps) => (
  <label
    htmlFor={htmlFor}
    className="flex gap-1 items-center text-body-m font-bold text-secondary-900"
  >
    {label}
    {required && <span className="text-body-m text-feedback-error-500">*</span>}
  </label>
)

export { FormFieldLabel }
