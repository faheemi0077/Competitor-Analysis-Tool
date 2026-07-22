import {useState} from "react";
import PlaybookReport from "./PlaybookReport.jsx"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Form() {
    const [playbook, setPlaybook] = useState(null);
    //async
    const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target));
    const res = await fetch(`${API_URL}/playbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPlaybook(data.playbook)
};
    if (playbook) return <PlaybookReport playbook={playbook} accent="#1877F2" />;
    return(
        <div className="form-container">
            <form onSubmit={handleSubmit}>
            <label>
                1. Can you provide a brief overview of your business and its core offerings?
                <br />
                <textarea 
                name="business_overview"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                 2. What sets your business apart from competitors (USP)?
                <br />
                <textarea 
                name="usp"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                3. Who are your primary competitors?
                <br />
                <textarea 
                name="competitors"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                4. What are the primary objectives of your Meta Ads campaign?
                <br />
                <textarea 
                name="campaign_objective"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                5. Who is your target audience? (demographics, geographics, psychographics)
                <br />
                <textarea 
                name="target_audience"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                6. What problems does your target audience face that your product/service solves?
                <br />
                <textarea 
                name="audience_pain_points"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                7. What products or services will be promoted?
                <br />
                <textarea 
                name="products_promoted"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                8. Are there specific offers, discounts, or promotions you'd like to highlight?
                <br />
                <textarea 
                name="offers_promotions"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                9. Are there competitors whose ads you admire?
                <br />
                <textarea 
                name="admired_competitor_ads"
                className="answer-input"
                rows={2}
                />
            </label>
            <label>
                10. What is your monthly budget for Meta Ads?
                <br />
                <textarea 
                name="monthly_budget"
                className="answer-input"
                rows={2}
                />
            </label>
            <button type="submit" className="submit-btn">Generate Playbook</button>
            </form>
        </div>
    );
}

export default Form