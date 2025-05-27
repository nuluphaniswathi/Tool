import React from 'react'

const CustomerSentimentUI = ({matchingMetric}) => {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center w-80 fs-8 p-3'>
    {matchingMetric?.weekend && (
        <>
          <p className="m-0">
            <strong>PGM:</strong>
            {matchingMetric?.gdo_approval === true
              ? " 👍"
              : matchingMetric?.gdo_approval === false
              ? " 👎"
              : " -"}
          </p>
          <p className="m-0">
            <strong>PM:</strong>
            {matchingMetric?.pm_approval === true
              ? " 👍"
              : matchingMetric?.pm_approval === false
              ? " 👎"
              : " -"}
          </p>
        </>
      )}
      {!matchingMetric?.weekend && !matchingMetric?.monthend && (
        <p className="m-0">
          <strong>PM:</strong>
          {matchingMetric?.pm_approval === true
            ? " 👍"
            : matchingMetric?.pm_approval === false
            ? " 👎"
            : " -"}
        </p>
      )}
    {!matchingMetric?.weekend && matchingMetric?.monthend && (
      <>
        <p className="m-0">
          <strong>PGM:</strong>
          {matchingMetric?.gdo_approval === true
            ? " 👍"
            : matchingMetric?.gdo_approval === false
            ? " 👎"
            : " -"}
        </p>
        <p className="m-0">
          <strong>DM:</strong>
          {matchingMetric?.customer_sentiment === true
            ? " 👍"
            : matchingMetric?.customer_sentiment === false
            ? " 👎"
            : " -"}
        </p>
        <p className="m-0">
          <strong>PM:</strong>
          {matchingMetric?.pm_approval === true
            ? " 👍"
            : matchingMetric?.pm_approval === false
            ? " 👎"
            : " -"}
        </p>
      </>
    )}
    </div>
  )
}

export default CustomerSentimentUI;