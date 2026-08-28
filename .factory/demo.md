# Work Receipt demo

- Demo URL: `https://field-time-invoice-proof.sociobot.in/demo` or `/?demo=1`.
- One click from the first screen opens a weekly receipt containing three realistic work sessions for Northwind website and Harbor research.
- The persistent banner says “Demo — sample data, nothing is saved” and offers **Reset demo** and **Start for real**.
- Demo sessions and receipt settings use IndexedDB database `demo:work-receipt`; its timer uses localStorage key `demo:work-receipt:active-timer`.
- Real data uses IndexedDB database `work-receipt` and localStorage key `work-receipt:active-timer`. Demo mode never opens that database.
- **Reset demo** clears and reseeds only the demo namespace. **Start for real** deletes the demo database and opens `/`.
