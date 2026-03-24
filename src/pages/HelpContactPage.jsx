import { useEffect, useMemo, useState } from "react";
import InfoBanner from "../components/InfoBanner";
import HelpLayout from "../components/HelpLayout";
import SectionPanel from "../components/SectionPanel";
import { trackEvent } from "../lib/analytics";

function buildContactFrameDoc() {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            margin: 0;
            font-family: Inter, system-ui, sans-serif;
            background: #eef5f8;
            color: #173047;
          }
          .shell {
            min-height: 100vh;
            padding: 18px;
            display: grid;
            gap: 16px;
            background: linear-gradient(180deg, #f8fbfd 0%, #ebf3f7 100%);
          }
          .card {
            background: white;
            border: 1px solid #cad6df;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 20px rgba(21, 47, 70, 0.08);
          }
          .form-grid {
            display: grid;
            gap: 12px;
          }
          label {
            display: grid;
            gap: 6px;
            font-weight: 600;
          }
          input,
          select,
          textarea {
            min-height: 40px;
            border-radius: 10px;
            border: 1px solid #92abc0;
            padding: 10px 12px;
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
            background: #28506f;
            color: #fff;
            font-weight: 700;
            font: inherit;
          }
          .status {
            min-height: 20px;
            color: #23603b;
            font-size: 13px;
          }
          .eyebrow {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #4f718f;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="shell">
          <div class="card">
            <div class="eyebrow">Embedded support workspace</div>
            <h2>Contact BluLedger Support</h2>
            <p>Use this same-origin support panel to send a training enquiry.</p>
          </div>
          <form class="card form-grid" id="contact-form">
            <label>
              Topic
              <select data-testid="contact-topic">
                <option value="online-banking">Online banking</option>
                <option value="card-support">Card support</option>
                <option value="transaction-question">Transaction question</option>
              </select>
            </label>
            <label>
              Preferred contact
              <select data-testid="contact-preferred-channel">
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
                <option value="Secure message">Secure message</option>
              </select>
            </label>
            <label>
              Full name
              <input data-testid="contact-full-name" type="text" value="Alicia Warren" />
            </label>
            <label>
              Email
              <input data-testid="contact-email" type="email" value="alicia.warren@bluledger-demo.au" />
            </label>
            <label>
              Message
              <textarea data-testid="contact-message">I need help checking a recent payment.</textarea>
            </label>
            <button data-testid="contact-submit" type="submit">Send to support</button>
            <div class="status" data-testid="contact-status" aria-live="polite"></div>
          </form>
        </div>
        <script>
          const form = document.getElementById("contact-form");
          form.addEventListener("submit", (event) => {
            event.preventDefault();
            const topic = document.querySelector('[data-testid="contact-topic"]').value;
            const preferredChannel = document.querySelector('[data-testid="contact-preferred-channel"]').value;
            const fullName = document.querySelector('[data-testid="contact-full-name"]').value.trim();
            const email = document.querySelector('[data-testid="contact-email"]').value.trim();
            const message = document.querySelector('[data-testid="contact-message"]').value.trim();
            const status = document.querySelector('[data-testid="contact-status"]');

            if (!message) {
              status.textContent = "Add a message before you send the request.";
              return;
            }

            status.textContent = "Support request queued for review.";
            window.parent.postMessage(
              {
                type: "bluledger-help-contact-submitted",
                payload: { topic, preferredChannel, fullName, email, message }
              },
              "*"
            );
          });
        </script>
      </body>
    </html>
  `;
}

function HelpContactPage() {
  const [submission, setSubmission] = useState(null);
  const frameDocument = useMemo(() => buildContactFrameDoc(), []);

  useEffect(() => {
    function handleMessage(event) {
      if (event.data?.type !== "bluledger-help-contact-submitted") {
        return;
      }

      setSubmission(event.data.payload);
      trackEvent("contact_support_submitted", {
        topic: event.data.payload.topic,
        preferred_channel: event.data.payload.preferredChannel,
      });
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <HelpLayout
      title="Contact Us"
      subtitle="Use the embedded support workspace to submit a realistic same-origin service request."
    >
      <InfoBanner
        title="Frame handling practice"
        message="This page intentionally embeds the support form inside an iframe while keeping the host page reactive to submissions."
        tone="info"
      />
      <SectionPanel
        title="Embedded Support Console"
        subtitle="The contact form below runs inside a same-origin iframe."
        testId="help-contact-panel"
      >
        <iframe
          className="help-embedded-frame"
          data-testid="help-contact-frame"
          title="Contact BluLedger Support"
          srcDoc={frameDocument}
        />
      </SectionPanel>
      <SectionPanel
        title="Escalation Summary"
        subtitle="When the embedded form submits, the host page records the request details here."
        testId="help-contact-summary-panel"
      >
        <div className="help-summary-card" data-testid="help-contact-summary">
          {submission ? (
            <dl className="help-summary-list">
              <div>
                <dt>Topic</dt>
                <dd>{submission.topic}</dd>
              </div>
              <div>
                <dt>Preferred contact</dt>
                <dd>{submission.preferredChannel}</dd>
              </div>
              <div>
                <dt>Submitted for</dt>
                <dd>{submission.fullName}</dd>
              </div>
              <div>
                <dt>Message</dt>
                <dd>{submission.message}</dd>
              </div>
            </dl>
          ) : (
            <div className="form-hint">
              No embedded request has been submitted yet.
            </div>
          )}
        </div>
      </SectionPanel>
    </HelpLayout>
  );
}

export default HelpContactPage;
