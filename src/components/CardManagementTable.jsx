import { useEffect, useState } from "react";
import StatusPill from "./StatusPill";

function CardManagementTable({
  cards,
  accounts,
  cardOptions,
  cardholderName,
  onToggleLock,
  onReplace,
  onSaveNickname,
  onToggleInternational,
  onViewLimits,
}) {
  const [nicknames, setNicknames] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [revealedNumbers, setRevealedNumbers] = useState({});

  useEffect(() => {
    const nextNicknames = {};
    cards.forEach((card) => {
      nextNicknames[card.id] = card.nickname;
    });
    setNicknames(nextNicknames);
  }, [cards]);

  function linkedAccountLabel(card) {
    const linkedAccount = accounts.find((account) => account.id === card.linkedAccountId);
    return linkedAccount ? linkedAccount.productName : "Linked account";
  }

  function handleNicknameSave(cardId) {
    const nextNickname = (nicknames[cardId] || "").trim();

    if (!nextNickname) {
      return;
    }

    onSaveNickname(cardId, nextNickname);
  }

  function cardScheme(card) {
    if (card.cardType.toLowerCase().includes("mastercard")) {
      return "Mastercard";
    }

    return "Visa";
  }

  function cardPreviewClass(card) {
    return card.cardType.toLowerCase().includes("mastercard")
      ? "card-preview card-preview--credit"
      : "card-preview card-preview--debit";
  }

  function cardSecurityCode(card) {
    return String((Number(card.lastFour) % 900) + 100);
  }

  function displayCardNumber(card, isRevealed) {
    const fullNumber = card.demoCardNumber || `0000 0000 0000 ${card.lastFour}`;

    if (isRevealed) {
      return fullNumber.split(" ");
    }

    return ["****", "****", "****", card.lastFour];
  }

  function toggleCardFlip(cardId) {
    setFlippedCards((current) => ({
      ...current,
      [cardId]: !current[cardId],
    }));
  }

  function toggleCardNumber(cardId) {
    setRevealedNumbers((current) => ({
      ...current,
      [cardId]: !current[cardId],
    }));
  }

  return (
    <div className="card-management-list">
      {cards.map((card) => (
        <article key={card.id} className="card-record">
          <div className="card-record__header">
            <div>
              <h3>{card.nickname}</h3>
              <div className="table-subline">
                {card.cardType} • {card.maskedNumber}
              </div>
            </div>
            <div className="card-record__status">
              <StatusPill status={card.status} />
              {card.replacementInProgress ? (
                <span className="card-record__note">Replacement in progress</span>
              ) : null}
            </div>
          </div>

          <div className="card-record__body">
            <div className="card-record__visual">
              <button
                type="button"
                className={`card-preview-flip${flippedCards[card.id] ? " is-flipped" : ""}`}
                onClick={() => toggleCardFlip(card.id)}
                aria-pressed={Boolean(flippedCards[card.id])}
              >
                <span className="card-preview-flip__inner">
                  <span className={`${cardPreviewClass(card)} card-preview--front`}>
                    <span className="card-preview__top">
                      <span className="card-preview__chip" />
                      <span className="card-preview__brand">{cardScheme(card)}</span>
                    </span>
                    <span className="card-preview__number">
                      {displayCardNumber(card, Boolean(revealedNumbers[card.id])).map(
                        (group, index) => (
                          <span
                            key={`${card.id}-${index}`}
                            className="card-preview__number-group"
                          >
                            {group}
                          </span>
                        )
                      )}
                    </span>
                    <span className="card-preview__footer">
                      <span>
                        <span className="card-preview__label">Cardholder</span>
                        <strong>{cardholderName.toUpperCase()}</strong>
                      </span>
                      <span>
                        <span className="card-preview__label">Expires</span>
                        <strong>{card.expiry}</strong>
                      </span>
                    </span>
                  </span>

                  <span className={`${cardPreviewClass(card)} card-preview--back`}>
                    <span className="card-preview__back-top">
                      <span className="card-preview__magstripe" />
                    </span>
                    <span className="card-preview__signature-panel">
                      <span className="card-preview__signature-block">
                        <span className="card-preview__label">Signature</span>
                        <strong>{cardholderName.toUpperCase()}</strong>
                      </span>
                      <span className="card-preview__security-block">
                        <span className="card-preview__label">CVV</span>
                        <strong>{cardSecurityCode(card)}</strong>
                      </span>
                    </span>
                    <span className="card-preview__back-footer">
                      <span className="card-preview__back-note">
                        BluLedger demo card. Contact support immediately if this card is lost or stolen.
                      </span>
                      <span className="card-preview__brand card-preview__brand--back">
                        {cardScheme(card)}
                      </span>
                    </span>
                  </span>
                </span>
              </button>
              <div className="card-preview__hint">
                {flippedCards[card.id] ? "Click card to return to front" : "Click card to view back"}
              </div>
              <div className="card-preview__actions">
                <button
                  type="button"
                  className="card-preview__icon-button"
                  onClick={() => toggleCardNumber(card.id)}
                  aria-pressed={Boolean(revealedNumbers[card.id])}
                  aria-label={
                    revealedNumbers[card.id] ? "Hide full card number" : "Show full card number"
                  }
                  title={
                    revealedNumbers[card.id] ? "Hide full card number" : "Show full card number"
                  }
                  data-testid={`card-reveal-number-${card.id}`}
                >
                  <span className="card-preview__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M1.5 12s3.8-6 10.5-6 10.5 6 10.5 6-3.8 6-10.5 6S1.5 12 1.5 12Z" />
                      <circle cx="12" cy="12" r="3.2" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div className="card-record__details">
              <dl className="card-detail-grid">
                <div>
                  <dt>Linked account</dt>
                  <dd>{linkedAccountLabel(card)}</dd>
                </div>
                <div>
                  <dt>Expiry</dt>
                  <dd>{card.expiry}</dd>
                </div>
                <div>
                  <dt>Card type</dt>
                  <dd>{card.cardType}</dd>
                </div>
                <div>
                  <dt>Daily ATM limit</dt>
                  <dd>${card.dailyLimit} AUD</dd>
                </div>
                <div>
                  <dt>Online purchase limit</dt>
                  <dd>${card.onlineLimit} AUD</dd>
                </div>
                <div>
                  <dt>Replacement fee</dt>
                  <dd>{cardOptions.replacementFee}</dd>
                </div>
              </dl>
            </div>

            <div className="card-record__controls">
              <div className="form-row">
                <label htmlFor={`nickname-${card.id}`}>Card nickname</label>
                <div className="card-inline-actions">
                  <input
                    id={`nickname-${card.id}`}
                    value={nicknames[card.id] || ""}
                    onChange={(event) =>
                      setNicknames((current) => ({
                        ...current,
                        [card.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="table-action"
                    onClick={() => handleNicknameSave(card.id)}
                    disabled={!(nicknames[card.id] || "").trim()}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="card-control-row">
                <div>
                  <div className="utility-label">International usage</div>
                  <label className="toggle-row">
                    <input
                      type="checkbox"
                      checked={card.internationalEnabled}
                      onChange={(event) =>
                        onToggleInternational(card.id, event.target.checked)
                      }
                    />
                    <span>{card.internationalEnabled ? "Enabled" : "Disabled"}</span>
                  </label>
                </div>
                <div>
                  <div className="utility-label">Replacement</div>
                  <div>{card.replacementInProgress ? "Tracking active" : "No request lodged"}</div>
                </div>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="table-action"
                  onClick={() => onToggleLock(card)}
                  data-testid="card-lock-toggle"
                >
                  {card.status === "Locked" ? "Unlock card" : "Lock card"}
                </button>
                <button
                  type="button"
                  className="table-action"
                  onClick={() => onReplace(card.id)}
                  data-testid="card-replace-button"
                >
                  Replace card
                </button>
                <button
                  type="button"
                  className="table-action"
                  onClick={() => onViewLimits(card, cardOptions)}
                >
                  View limits
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default CardManagementTable;
