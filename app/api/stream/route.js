import os from "os";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      function send(obj) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      }
      const interval = setInterval(() => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const load = os.loadavg()[0];
        const uptime = os.uptime();
        send({
          type: "system",
          ts: Date.now(),
          memUsedPct: +(usedMem / totalMem * 100).toFixed(2),
          load1m: +load.toFixed(2),
          uptimeSec: uptime,
        });
      }, 1000);
      const heartbeat = setInterval(() => controller.enqueue(encoder.encode(`: keep-alive\n\n`)), 15000);
      return () => {
        clearInterval(interval);
        clearInterval(heartbeat);
      };
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
