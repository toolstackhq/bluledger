import { useEffect, useRef } from "react";

const ELEMENT_NAME = "blu-feedback-widget";

function defineFeedbackWidget() {
  if (window.customElements.get(ELEMENT_NAME)) {
    return;
  }

  class BluFeedbackWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    connectedCallback() {
      this.render();
    }

    handleSubmit(event) {
      event.preventDefault();
      const category = this.shadowRoot.querySelector('[data-testid="feedback-category"]').value;
      const rating = this.shadowRoot.querySelector('[data-testid="feedback-rating"]').value;
      const summary = this.shadowRoot.querySelector('[data-testid="feedback-summary"]').value.trim();
      const allowFollowUp = this.shadowRoot.querySelector('[data-testid="feedback-follow-up"]').checked;
      const status = this.shadowRoot.querySelector('[data-testid="feedback-status"]');

      if (!summary) {
        status.textContent = "Add a short summary before sending feedback.";
        status.dataset.state = "error";
        return;
      }

      status.textContent = "Feedback captured for the BluLedger service desk.";
      status.dataset.state = "success";

      this.dispatchEvent(
        new window.CustomEvent("feedback-submit", {
          detail: {
            category,
            rating,
            summary,
            allowFollowUp,
          },
        })
      );
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            padding: 20px;
            border-radius: 14px;
            border: 1px solid #c5d3df;
            background: linear-gradient(180deg, #f9fcff 0%, #eef4f8 100%);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
          }
          form {
            display: grid;
            gap: 14px;
          }
          label {
            display: grid;
            gap: 6px;
            color: #13324d;
            font-weight: 600;
            font-family: ui-sans-serif, system-ui, sans-serif;
          }
          select,
          textarea {
            min-height: 40px;
            border: 1px solid #93abc0;
            border-radius: 10px;
            padding: 10px 12px;
            background: #fff;
            color: #1d2e3f;
            font: inherit;
          }
          textarea {
            min-height: 120px;
            resize: vertical;
          }
          button {
            min-height: 42px;
            border: 0;
            border-radius: 10px;
            background: #2f5d85;
            color: white;
            font-weight: 700;
            font: inherit;
          }
          .checkbox-row {
            display: flex;
            gap: 8px;
            align-items: center;
            color: #13324d;
            font-family: ui-sans-serif, system-ui, sans-serif;
          }
          .status {
            min-height: 18px;
            color: #31597b;
            font-size: 13px;
            font-family: ui-sans-serif, system-ui, sans-serif;
          }
          .status[data-state="error"] {
            color: #9f2f39;
          }
          .status[data-state="success"] {
            color: #23603b;
          }
        </style>
        <form>
          <label>
            Feedback category
            <select data-testid="feedback-category">
              <option value="navigation">Navigation</option>
              <option value="forms">Forms and workflows</option>
              <option value="accessibility">Accessibility</option>
              <option value="mobile">Mobile responsiveness</option>
            </select>
          </label>
          <label>
            Experience rating
            <select data-testid="feedback-rating">
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="needs-work">Needs work</option>
            </select>
          </label>
          <label>
            Feedback summary
            <textarea
              data-testid="feedback-summary"
              placeholder="Tell us what worked well or what you would improve."
            ></textarea>
          </label>
          <label class="checkbox-row">
            <input data-testid="feedback-follow-up" type="checkbox" />
            <span>Allow a follow-up from the product team</span>
          </label>
          <button data-testid="feedback-submit" type="submit">Send feedback</button>
          <div class="status" data-testid="feedback-status" aria-live="polite"></div>
        </form>
      `;

      this.shadowRoot.querySelector("form").addEventListener("submit", this.handleSubmit);
    }
  }

  window.customElements.define(ELEMENT_NAME, BluFeedbackWidget);
}

function OpenFeedbackWidget({ onSubmit }) {
  const hostRef = useRef(null);

  useEffect(() => {
    defineFeedbackWidget();
  }, []);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return undefined;
    }

    function handleSubmit(event) {
      onSubmit(event.detail);
    }

    host.addEventListener("feedback-submit", handleSubmit);
    return () => host.removeEventListener("feedback-submit", handleSubmit);
  }, [onSubmit]);

  return <blu-feedback-widget ref={hostRef} data-testid="help-feedback-widget" />;
}

export default OpenFeedbackWidget;
