import React from 'react'
import { FcInfo } from 'react-icons/fc'
import "../manage-process/Vitals/vitals-body.css";
const CSGuidelines = () => {
  return (
    <div className="vital-tooltip-wrapper ps-2" >
    <FcInfo size={25} className="icon-margin" title="Customer Sentiment Guidelines"/>
    <div className="vital-tooltip-text">
    <ul>
            <li className="no-list-style">
                <p><strong>ℹ️ Customer Sentiment Guidelines</strong></p>
                <hr></hr>
                <strong>👍👎 Daily Voting Requirement:</strong>
                <p>Project Managers (PM), Program Managers (PGM), and Delivery Managers (DM) must provide a thumbs up or thumbs down each day.</p>
                <strong>✅ Voting Rules:</strong>
                <ul>
                    <li>
                    If the same person holds both PM and PGM roles:
                        <ul type="circle">
                            <li><span>Their vote is counted twice (once for each role).</span></li>
                            <li><span>Their role is recorded as PGM, and if they approve as PGM, it's also considered approved for PM — and vice versa.</span></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li className="no-list-style">
                <strong>📅 Weekday & Weekend Logic:</strong>
                <ul>
                    <ul type="circle">
                    <li><span>Weekdays: Monday to Thursday</span></li>
                    <li><span> Weekend: Friday</span></li>
                    </ul>
                    <p>🔁 If Friday is a holiday:</p>
                    <ul>
                    <li>Weekend shifts to Thursday</li>
                    <li>Weekdays become Monday to Wednesday</li>
                    <p>(The same shift applies for other holiday adjustments.)</p>
                    </ul>
                </ul>
            </li>
            <li className="no-list-style">
                <strong>🗓️ Weekday Voting (Mon–Thu):</strong>
                <ul>
                    <li>Only the PM's vote is required.</li>
                    <li>If PGM and DM also vote, we take the average of all votes.</li>
                </ul>
            </li>
            <li className="no-list-style">
                <strong>📆 Weekend Voting (Usually Friday):</strong>
                <ul>
                    <li>Both PM and PGM must vote.</li>
                    <li>If either misses voting, the status is Red (Non-Compliant).</li>
                </ul>
            </li>
            <li className="no-list-style">
                <strong>📈 Month-End Voting:</strong>
                <ul>
                    <li>All three — PM, PGM, and DM — must cast their votes.</li>
                    <li>If any one misses, status is Red (Non-Compliant).</li>
                </ul>
            </li>
        </ul>
     </div> 
</div>
  )
}

export default CSGuidelines