export const Label = ({ labelName, isRequired = false }) => {
    return (
        <label
            htmlFor={labelName}
            className="form-label"
        >
            {labelName}
            {isRequired && <span className="error-msg">*</span>}
        </label>
    )
}

export const InputElement = (props) => {
    const { idName, inputType, className, registerFields, isRequired } = props;

    return (
        <input
            id={idName}
            name={idName}
            type={inputType}
            className={className}
            {...registerFields(idName, { 
                required: isRequired,
                validate: (value) => value.trim() !== "" || "Only spaces are not allowed",
            })}
        />
    )
}

export const TextAreaElement = (props) => {
    const { idName, inputType, className, registerFields, isRequired } = props;

    return (
        <textarea
            id={idName}
            name={idName}
            type={inputType}
            className={className}
            {...registerFields(idName, { 
                required: isRequired,
                validate: (value) => value.trim() !== "" || "Only spaces are not allowed",
            })}
        />
    )
}

export const FieldError = ({ labelName }) => {
    return (
        <span className="fw-normal text-danger mb-0 pb-0">
            * {labelName} is required.
        </span>
    )
}