// Course lists transcribed from the corresponding original bundle pages.
const BUNDLES = {
  "11766c24-60df-47d8-935b-56f5236334af": [
    ["e3ae3554-256d-4c2b-b540-afbd738a13da", "Astrology Basic to Advance Course By Acharya Pankaj Ji Vastu Shikhar", "34d54f5c-f7ae-46a1-aa78-68f6176c6647.jpg", ""],
    ["57640c70-59f3-4f87-add8-9713d7026560", "Vastu Course (Basic to Advanced) By Acharya Pankaj Ji Vastu Shikhar", "d8d7c82d-6ce1-4364-a630-63ac1bac431b.jpg", ""]
  ],
  "8770b278-71bd-4423-919e-3e968fe9f8ee": [
    ["f4132172-dcfb-462e-b6c3-b4d5ef675744", "STAGE Academy By Vinh Giang Complete Course", "a43c0eb9-a9e6-49a3-b09d-979550412811.jpg", "SocialSkills"],
    ["6b96fa61-1c97-4c8b-b323-4475556d0aba", "Break the Mold 27-28-29 April 2026 Live Event By Vinh Giang", "7ef7adaf-b0c7-4562-8c91-eda9ab4519e8.jpg", "SocialSkills"],
    ["452f3425-03e1-417e-bdb2-b6d6d1de2703", "Recalibrate Your Life By Vinh Giang and Ali Terai", "9f7a6ebb-b0fb-433e-9ea4-615720752842.jpg", "SocialSkills"]
  ],
  "57e75f14-fa03-4029-9575-fc05e7b0223c": [
    ["11f1a23a-18a4-4365-8df6-dd58dc12170a", "Life Mastercourse By Ravi Kapoor (Syllabus of Life)", "e0a6b44c-961f-4c10-a41e-849fb0da52d2.jpg", "SelfGrowth"],
    ["4de2de04-32ae-411a-a025-034a6a72139d", "The 21-Day Consistency Challenge By Ravi Kapoor Ex-IRS Officer", "a038d31f-5b05-400f-83d8-c2210007355a.jpg", "SelfGrowth"]
  ],
  "e7643838-5cef-421d-a546-d9d5df2e1628": [
    ["9b2dc7ba-7981-4d26-8e6d-abcc2336ab26", "Advance English Course By Janhavi Panwar", "5bea2d14-4af0-4b6d-8d15-f71b0cb8e6c3.jpg", ""],
    ["03ff4d21-1d28-43f5-a34d-d3a7aa95562e", "American Accent Course By Janhavi Panwar", "24289ce3-6e37-4953-82a2-119d2a2a7b3a.jpg", ""],
    ["8ff5722a-bab5-4891-b2f5-ec7a86df5c54", "BASIC ENGLISH LANGUAGE COURSE — JANHAVI PANWAR", "5385091f-4907-4904-97c7-29d8a43d2dbb.jpg", ""],
    ["f80978ab-b384-4df4-b7e3-496b24372878", "British Accent Course By Janhavi Panwar", "d731dc8e-3f42-44e6-afb2-4b9806e2547e.jpg", ""],
    ["004621c7-2b42-4649-a9b8-de93748939fc", "IELTS FULL COURSE — JANHAVI PANWAR", "32539c1d-e9db-4a72-95ea-9506b0991f13.jpg", ""]
  ],
  "be26d1fb-1dff-425b-83b1-17fc474fa2c5": [
    ["e4cc5976-a424-4947-93e8-08f4b20e9706", "ED Mastery By Dr. Sunil Jindal", "95da0354-4f7e-411c-afe5-61b2f80c0e6a.jpg", ""],
    ["5db4972e-d41e-4722-9602-e31eb9c45405", "PE Mastery By Dr. Sunil Jindal", "4f98dbaa-1f45-40ae-a0a5-7e03a0347110.jpg", ""],
    ["c1e74aec-5003-45a5-a7dd-a04872aefc96", "Desire Mastery", "8699f35f-175a-4e2e-8e1c-384362465a40.jpg", ""],
    ["6941526f-6264-4410-ba20-df79594a28ba", "Intimacy Mastery", "9712a4fd-89de-446b-a3b3-17b0a598cdb7.jpg", ""],
    ["40b66aad-55c8-4208-96d5-31422c6c5c38", "Sexercise Mastery", "d196c840-9ebb-410b-a97e-f5e7728f6389.jpg", ""],
    ["71272c30-5195-4d89-95a7-dffe49b6256c", "Sexual Control Starter - Extra Bonus", "19e219c3-abf9-4892-bd18-911400afccdf.jpg", ""]
  ],
  "92c9b2bb-e3d4-4387-a5b6-649a3fb37f5a": [
    ["d51f13f3-1dc4-4fea-b3b2-e8c92a8eb3bf", "NitishFX Elite Pack", "427e40f3-b67d-457c-93fb-1fdcf3c2a818.jpg", "Finance"],
    ["b80c346f-72a7-4d4f-88b0-e5bc31d67e0b", "NitishFX ELITE PRO", "8aba2080-fe45-40dd-b9cc-d9564f83afb3.jpg", "Finance"],
    ["659ad0e0-22d3-4895-9722-c8068793214c", "Secret Indicator to Find Liquidity and Sniper Entries", "f5df578b-bbbe-4e50-8ec1-6cd82b0290ba.jpg", "Finance"],
  ],
  "13a293ae-3567-4f85-a97b-702a91be93fa": [
    ["ac864542-c756-46f1-adc7-1adb01fe829e", "Debt Management Masterclass", "4f700ebd-ddb5-44c0-8f04-74de0a178a79.jpg", "Finance"],
    ["d54f6d86-82ad-4df2-a303-69f5b2129587", "Financial Planning & Retirement Planning Masterclass", "6717d267-3d57-4f36-9b50-2f49f48c2b97.jpg", "Finance"],
    ["c53e7fb1-e0d2-4a6d-88de-f0142cc3f689", "Insurance Masterclass", "b1dc3c08-5558-422a-8890-8602c85e36d6.jpg", "Finance"],
    ["28e82011-66ee-4b86-b956-e65f02a8ca36", "Investors Notes & Wisdom", "d7f813ec-43b7-4bcc-a749-0b05c3b3be28.jpg", "Finance"],
    ["658b2ffc-0c48-44c7-91b8-8dc74032099c", "Mutual Funds Masterclass Recorded Sessions", "ad33b1db-8dda-459a-9e3e-6a5f853c49a4.jpg", "Finance"],
  ],
  "2c7e4ff9-f163-4390-b4b5-98f7693dc25c": [
    ["8d78af4b-b5a6-442f-ab4e-6f2aead769fc", "Decoding Futures & Options Video Course By Zebra Learn", "0398ce20-42f9-4ef0-ade8-d192e0e59f03.jpg", ""],
    ["bf951b4a-055c-4ef7-8028-41660bcef420", "Financial Analysis of Companies Video Course By Zebra Learn", "20bc5c91-f467-4c01-a728-f69354a6badd.jpg", ""],
    ["533366e2-28fd-43cf-aa25-b0384c9faf59", "Financial Modeling & Valuations Video Course By Zebra Learn", "cda17f99-a864-42e6-8bff-d5752587c4e4.jpg", ""],
    ["4754b08c-f8d8-4de6-ada6-b4a9f008b824", "How to Raise Your First Crore -Fund Raise Video Course By Zebra Learn", "16efa8ac-8262-4ce8-881b-5ae69d3e6c96.jpg", ""],
    ["f191b162-ee44-4372-a689-2a38ee827a0a", "Investing Psychology Video Course By Zebra Learn", "78d140d5-26d6-4456-b5ef-61910c8218c6.jpg", ""],
    ["cac32141-b64a-40ad-951f-410554d4d681", "MS Excel for Finance Video Course By Zebra Learn", "a3027311-f401-441b-aaca-ce98817dde8c.jpg", ""],
    ["be4db014-a801-44d6-8b3f-f1a74b11b6c8", "Stock Investing for Individuals Video Course By Zebra Learn", "7138c4a0-270a-45ed-885c-ed95f2c94078.jpg", ""],
  ],
  "f207b568-5379-4993-8022-9f68165ddd5f": [
    ["d414df3b-9236-4696-a53a-13f0206ef085", "Personal Branding Course", "f169122f-a36f-43cb-a562-61c10d3b39d2.jpg", "Marketing"],
    ["43d2420d-9a12-42a6-9376-aabcda01dd6a", "Learn complete Meta Ads Course By Prince Jalani", "7953efd3-5764-4911-8f14-c2e9a947d05f.jpg", "Marketing"],
    ["87016fdb-c885-49a0-8064-81114477cd3e", "How to Make Great Ads", "04aa5e4f-4348-42b5-b3c8-6fde433f760d.jpg", "Marketing"],
    ["8b33e76a-73cd-4cf2-ba66-6ee9b65e910b", "THe Ads Toolkit", "bdadb993-1faa-4c85-9f52-c5db5137fdff.jpg", "Marketing"],
    ["d9ae8a01-d07e-40f1-ae11-ee714aaa7ae5", "Learn Complete Google Ads & Youtube Ads", "3c457d29-bae4-4de4-81f8-bc90e38bb3e0.jpg", "Marketing"],
    ["5f18c3bd-3695-450e-8bcb-861cfdb8b336", "Rapid Growth Marketing Toolkit", "f10a8dde-5b25-4fed-948e-bb2306bc3e42.jpg", "Marketing"],
    ["5ff6ba28-53ea-4343-aedf-d7877dd6bb98", "Meta Scaling Toolkit – Secrets to Scaling Ads Profitably (PDF Guides) By Prince Jalani", "7280c09b-0ae6-41e9-b878-00713b999e4a.jpg", "Marketing"],
  ],
  "5fffbc55-a8b2-4002-95fa-cee726172ca2": [
    ["042e2b80-e6d7-4b2b-b4b2-35250c503478", "Business Finance Course By Basesh Gala (Business Mentor and Coach)", "08c2c4b5-b4a2-4032-ad66-c48cca9604a7.webp", "Business&Sales"],
    ["6e3d20e8-dcc4-4c3b-a8ee-28897146a73d", "Business Foundation Course By Basesh Gala (Business Mentor and Coach)", "2c825bab-f818-4b33-a9c0-66e35b104c0b.webp", "Business&Sales"],
    ["ba74a001-eec3-4ef3-9c89-b2f69b7323b5", "Business Growth E-Books By Basesh Gala (Business Mentor and Coach)", "d2651c2c-886f-419f-809e-5631709ccd3b.webp", "Business&Sales"],
    ["b708fa0d-ddc7-4156-807a-ad90b32d4cfe", "Day RISE Grow Workshop By Basesh Gala (Business Mentor and Coach)", "6cdf0939-5456-4816-881e-10b4088a0fdc.webp", "Business&Sales"],
    ["12d055d1-ae16-4dcb-8285-ffe36d67915c", "Personal Finance Course By Basesh Gala (Business Mentor and Coach)", "9fca27be-6ce2-47e1-acfe-33d992023708.webp", "Business&Sales"],
    ["5e7e1e31-8a02-4229-ad50-f03b76a31d7e", "Rise Business Mastery - Mini MBA By Basesh Gala (Business Mentor and Coach)", "7140fcb1-b1f4-432e-b7fa-fc99706d5c15.webp", "Business&Sales"],
    ["01d10e1e-2a49-4274-995a-285ef927e230", "RiSE Habit 7 Months Comprehensive Mentoring Course By Basesh Gala (Business Mentor and Coach)", "98ba4e67-5d5d-446a-a166-563e7ad98350.webp", "Business&Sales"],
    ["67e4dd39-bef6-4336-9ee2-87e0de48b1c5", "Rise To Lead Course By Basesh Gala (Business Mentor and Coach)", "dc91d1a5-5b96-448e-b15f-9e84afc5037f.webp", "Business&Sales"]
  ],
  "59d7c418-542f-4c07-b57d-58a2cd8e3634": [
    ["094f1ec0-da15-44f5-8a77-bc507edf37a2", "Advanced Tracking Course (Become Tracking Expert) By Umar Tazkeer", "6bf234f1-b263-40a8-9f13-461b7b73b36a.webp", "Marketing"],
    ["99d521de-5ecd-45b4-92b5-0eb597859211", "AI First - Digital Marketing Course (Specially for Beginners) | 10th July 2026 By Umar Tazkeer", "1687a8f1-149e-4fb7-a1c6-3d04ca3270a0.webp", "Marketing"],
    ["37cece55-68e8-414a-a5f8-be228159e7de", "AI Landing Page Mastery - With Automations, Tracking & Backend By Umar Tazkeer", "1a5db317-bf86-47eb-91b7-ee2a9db01cc8.webp", "Marketing"],
    ["89a860db-8767-4f90-a67f-036c3218170d", "AI-Powered Shopify Development Course By Umar Tazkeer", "70b9ffa0-5d92-4f6a-b96e-a385dfba20ca.webp", "Marketing"],
    ["aad33346-dd94-4923-810a-37ad99ebfcf9", "Data Analytics for Digital Marketers By Umar Tazkeer", "587c6055-e947-4b81-bf81-3e64fd519eaa.webp", "Marketing"],
    ["08450cb4-a6ca-431d-984c-21fe7acc44d3", "Digital Marketing Bootcamp 4.0 By Umar Tazkeer", "80e47577-35bc-486d-90b8-aec90019637c.webp", "Marketing"],
    ["331bf6c0-2155-4696-8280-16fae9d3930d", "Google Ads Checklist + Media Buying Sheet + Calculators By Umar Tazkeer", "cc48c942-59a0-4f63-85bc-4685553631b6.webp", "Marketing"],
    ["450aae62-8742-49f0-a5bb-1043b43e1667", "Google Ads Course - 2026 (Certified Advanced Course) By Umar Tazkeer", "19f54877-3edd-4068-a411-807935a8bd25.webp", "Marketing"],
    ["f4c729ff-f847-4879-92be-75c27c550fc0", "Performance Marketing for D2C BootCamp (Meta Special) By Umar Tazkeer", "3f4f01ef-5374-432d-b701-529d1e913a33.webp", "Marketing"]
  ]
};
const BUNDLE_COURSES = Object.values(BUNDLES).flat().map(([id, title, thumbnail, category]) => ({ id, title, thumbnail: THUMB(thumbnail), category }));
