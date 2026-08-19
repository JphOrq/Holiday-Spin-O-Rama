  const CONFIG = {
        christmas: {
          title: "Spin into Christmas Chaos!",
          subtitle:
            "One click. One ridiculous prize. Absolutely no elves were consulted.",
          panel: "🎁 What will you get?",
          hub: "🎁",
          prizes: [
            "🍪 Cookie",
            "🎁 Mystery Gift",
            "🧦 Cozy Socks",
            "☕ Hot Cocoa",
            "🎅 Santa High-Five",
            "🦌 Reindeer Ride",
            "✨ Magic Luck",
            "🎄 Mega Cheer",
          ],
          winnerMessages: [
            "HO HO HO!",
            "JINGLE YES!",
            "MERRY WINNER!",
            "YOU GOT IT!",
          ],
        },
        newyear: {
          title: "🎆 New Year Spin-O-Rama!",
          subtitle:
            "Spin your way into the new year. Confetti is mandatory. Resolutions are optional.",
          panel: "🥂 Your New Year fate:",
          hub: "🥂",
          prizes: [
            "🥳 Party Time",
            "🍕 Pizza Forever",
            "💰 Lucky Break",
            "✨ Main Character",
            "🎇 Fireworks",
            "🕺 Dance Bonus",
            "🍀 Mega Luck",
            "🏆 Golden Year",
          ],
          winnerMessages: [
            "CHEERS!",
            "NEW YEAR, NEW WIN!",
            "BOOM! 🎆",
            "LUCKY YOU!",
          ],
        },
      };

      let mode = "christmas";
      let spinning = false;
      let rotation = 0;
      let soundOn = true;
      let audioCtx = null;

      const $ = (id) => document.getElementById(id);
      const wheel = $("wheel"),
        labels = $("labels"),
        result = $("result");

      function renderMode() {
        const c = CONFIG[mode];
        document.body.classList.toggle("theme-newyear", mode === "newyear");
        $("title").textContent = c.title;
        $("subtitle").textContent = c.subtitle;
        $("panelTitle").textContent = c.panel;
        document.querySelector(".hub").textContent = c.hub;
        $("themeBtn").textContent =
          mode === "christmas" ? "🎆 New Year Mode" : "🎄 Christmas Mode";
        labels.innerHTML = c.prizes.map((x) => `<span>${x}</span>`).join("");
        result.textContent = "SPIN ME!";
        rotation = 0;
        wheel.style.transform = "rotate(0deg)";
      }

      function audio() {
        if (!soundOn) return null;
        if (!audioCtx)
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();
        return audioCtx;
      }
      function tone(
        freq,
        duration = 0.08,
        type = "sine",
        volume = 0.045,
        delay = 0,
      ) {
        const ctx = audio();
        if (!ctx) return;
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
        g.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + delay + duration,
        );
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + delay);
        o.stop(ctx.currentTime + delay + duration + 0.02);
      }
      function spinSound() {
        for (let i = 0; i < 18; i++)
          tone(160 + i * 24, 0.035, "square", 0.025, i * 0.09);
      }
      function winSound() {
        [523, 659, 784, 1047].forEach((f, i) =>
          tone(f, 0.22, "sine", 0.055, i * 0.09),
        );
      }

      function confetti() {
        const box = $("confetti");
        box.innerHTML = "";
        for (let i = 0; i < 90; i++) {
          const b = document.createElement("b");
          b.style.left = "50%";
          b.style.top = "45%";
          b.style.background = [
            "#ef4444",
            "#22c55e",
            "#fbbf24",
            "#3b82f6",
            "#ec4899",
            "#8b5cf6",
          ][i % 6];
          b.style.setProperty("--x", `${(Math.random() - 0.5) * 110}vw`);
          b.style.setProperty("--y", `${(Math.random() - 0.5) * 100}vh`);
          b.style.transform = `rotate(${Math.random() * 360}deg)`;
          box.appendChild(b);
        }
        setTimeout(() => (box.innerHTML = ""), 1600);
      }

      function addHistory(text) {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = text;
        $("history").prepend(chip);
        while ($("history").children.length > 5)
          $("history").lastChild.remove();
      }

      $("spin").addEventListener("click", () => {
        if (spinning) return;
        spinning = true;
        $("spin").disabled = true;
        const c = CONFIG[mode];
        audio();
        spinSound();
        const index = Math.floor(Math.random() * c.prizes.length);
        const slice = 360 / c.prizes.length;
        const target = 360 * 6 + (360 - (index * slice + slice / 2));
        rotation += target;
        wheel.style.transform = `rotate(${rotation}deg)`;
        result.textContent = "🎲 SPINNING...";
        setTimeout(() => {
          result.textContent = c.prizes[index];
          addHistory(c.prizes[index]);
          winSound();
          confetti();
          setTimeout(
            () =>
              (result.textContent =
                c.winnerMessages[
                  Math.floor(Math.random() * c.winnerMessages.length)
                ]),
            700,
          );
          spinning = false;
          $("spin").disabled = false;
        }, 4250);
      });

      $("themeBtn").addEventListener("click", () => {
        mode = mode === "christmas" ? "newyear" : "christmas";
        renderMode();
      });
      $("soundBtn").addEventListener("click", () => {
        soundOn = !soundOn;
        $("soundBtn").textContent = soundOn ? "🔊 Sound On" : "🔇 Sound Off";
        if (soundOn) {
          audio();
          tone(660, 0.12, "sine", 0.04);
        }
      });

      renderMode();

      // Get the current year
var currentYear = new Date().getFullYear();

// Update the content of the element with id="currentYear"
document.getElementById("currentYear").textContent = currentYear;