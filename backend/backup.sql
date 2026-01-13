--
-- PostgreSQL database cluster dump
--

\restrict kzHW6JBBGzOFdEzUO1cmfyX7D4z4BuRaBnzOQkwaaLSQhXSDpCdG2qnUNhtRN7n

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE wintense;
ALTER ROLE wintense WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:a+rHQZcqX0/ctVBJ3/b2IQ==$HPE0srGeoPZyXzBwrjOYpGkSy5DbEaO4it+nXBt4iC8=:klakMPUm7AIcwpMBLrAPaM1r45eEjhLsW8dNGm52jjY=';

--
-- User Configurations
--








\unrestrict kzHW6JBBGzOFdEzUO1cmfyX7D4z4BuRaBnzOQkwaaLSQhXSDpCdG2qnUNhtRN7n

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict gW31wJ0SbZyybZtopA3M6YuMIcLRJiax7wxArJ9deUWDKMpTMkNJOyDc1bbgAPh

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict gW31wJ0SbZyybZtopA3M6YuMIcLRJiax7wxArJ9deUWDKMpTMkNJOyDc1bbgAPh

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict 4IVt7W93ZGrdMdnsi25Ry07LGiB99UGqaSAM3L2gXz0rbaSSCDqex1io2bSWVYv

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict 4IVt7W93ZGrdMdnsi25Ry07LGiB99UGqaSAM3L2gXz0rbaSSCDqex1io2bSWVYv

--
-- Database "wintensecare" dump
--

--
-- PostgreSQL database dump
--

\restrict KC14WypOHnN8FImcMOBXfLfvHkahYnRMGdm1abVY9VnEYEY29Du6JTt9RZ3tfS8

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: wintensecare; Type: DATABASE; Schema: -; Owner: wintense
--

CREATE DATABASE wintensecare WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE wintensecare OWNER TO wintense;

\unrestrict KC14WypOHnN8FImcMOBXfLfvHkahYnRMGdm1abVY9VnEYEY29Du6JTt9RZ3tfS8
\connect wintensecare
\restrict KC14WypOHnN8FImcMOBXfLfvHkahYnRMGdm1abVY9VnEYEY29Du6JTt9RZ3tfS8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Alert; Type: TABLE; Schema: public; Owner: wintense
--

CREATE TABLE public."Alert" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "deviceId" text NOT NULL,
    metric text NOT NULL,
    value integer NOT NULL,
    severity text NOT NULL,
    message text NOT NULL,
    acknowledged boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Alert" OWNER TO wintense;

--
-- Name: Device; Type: TABLE; Schema: public; Owner: wintense
--

CREATE TABLE public."Device" (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Device" OWNER TO wintense;

--
-- Name: Telemetry; Type: TABLE; Schema: public; Owner: wintense
--

CREATE TABLE public."Telemetry" (
    id text NOT NULL,
    "deviceId" text NOT NULL,
    "heartRate" integer NOT NULL,
    steps integer NOT NULL,
    battery integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Telemetry" OWNER TO wintense;

--
-- Name: User; Type: TABLE; Schema: public; Owner: wintense
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text,
    password text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    phone text
);


ALTER TABLE public."User" OWNER TO wintense;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: wintense
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO wintense;

--
-- Data for Name: Alert; Type: TABLE DATA; Schema: public; Owner: wintense
--

COPY public."Alert" (id, "userId", "deviceId", metric, value, severity, message, acknowledged, "createdAt") FROM stdin;
afbe749e-e4cc-40ed-a9a9-298a60f70862	a279d9b2-fec2-4db6-921c-155290ef75c9	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	HEART_RATE	190	CRITICAL	Sustained high heart rate detected	f	2025-12-18 08:03:41.918
f3d7cd88-cba0-4056-8653-8530582611a7	a279d9b2-fec2-4db6-921c-155290ef75c9	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	HEART_RATE	797	WARNING	Elevated heart rate detected	f	2025-12-18 08:04:12.723
8c0127ed-1f8c-4119-a6a1-944758f19dfa	a279d9b2-fec2-4db6-921c-155290ef75c9	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	BATTERY	4	WARNING	Device battery is low	f	2025-12-18 08:04:12.744
9469805f-392f-417c-9dc5-70b128685840	cd0c2813-5c42-48c2-84cb-59643aced6b9	063bb4e3-2654-4a5d-a0db-8b8e35306d69	HEART_RATE	190	WARNING	Elevated heart rate detected	t	2025-12-18 10:03:34.823
ac75b137-96b2-455f-92e9-b75323dcf805	cd0c2813-5c42-48c2-84cb-59643aced6b9	063bb4e3-2654-4a5d-a0db-8b8e35306d69	BATTERY	8	WARNING	Device battery is low	t	2025-12-18 10:03:17.796
e1a1bd14-5229-4664-9251-fafc2e359a61	cd0c2813-5c42-48c2-84cb-59643aced6b9	063bb4e3-2654-4a5d-a0db-8b8e35306d69	HEART_RATE	190	CRITICAL	Sustained high heart rate detected	t	2025-12-18 10:02:41.447
c99e7cc1-2d0b-42d5-b00e-14984f215b62	cd0c2813-5c42-48c2-84cb-59643aced6b9	063bb4e3-2654-4a5d-a0db-8b8e35306d69	HEART_RATE	290	CRITICAL	Sustained high heart rate detected	f	2025-12-18 10:25:24
a0f1c92a-23ae-4bd2-bddc-e4bb774a3d3f	24455c80-6f92-42e6-bfb2-b5850350ca93	7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	HEART_RATE	170	WARNING	Elevated heart rate detected	f	2025-12-18 11:13:40.667
cba1646b-07ef-4634-b7dd-4c8ce052ebda	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	180	WARNING	Elevated heart rate detected	t	2025-12-22 07:34:57.492
92f9e614-a139-4751-a92c-ed639cf56c92	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	230	WARNING	Elevated heart rate detected	t	2025-12-23 06:29:11.117
e89881ef-bb47-4221-91e5-aab4bec94b50	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	190	CRITICAL	Sustained high heart rate detected	t	2025-12-24 04:40:14.858
675ec2a4-ecf4-4245-b386-ad5d8cd39659	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	175	WARNING	Elevated heart rate detected	t	2025-12-24 04:40:24.307
9f04fb56-23e5-4433-ba15-3f10d5c9a5dc	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	290	CRITICAL	Sustained high heart rate detected	t	2025-12-24 04:42:43.639
ba91df1f-759a-4c56-90ef-6202b33ec840	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	190	CRITICAL	Sustained high heart rate detected	t	2025-12-24 05:57:42.976
d8b9c6bc-c7d3-4e49-be48-891fe0806d44	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	190	CRITICAL	Sustained high heart rate detected	t	2025-12-24 07:23:03.718
f909a340-74d0-43ce-b5d4-24d86c22d3d5	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	190	CRITICAL	Sustained high heart rate detected	t	2025-12-24 09:58:22.655
bbfdff27-e3e9-4c58-a6d6-9ab499b35289	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	165	WARNING	Elevated heart rate detected	t	2025-12-24 07:23:15.993
4395ae47-163f-487f-aed8-acc8be8b8860	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	190	CRITICAL	Sustained high heart rate detected	f	2025-12-26 07:06:03.987
b3068421-13d6-4747-bf25-59a2dbe10533	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	BATTERY	5	WARNING	Device battery is low	t	2025-12-29 10:32:43.946
a84575e3-961c-4970-b4fd-06c987163660	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	180	WARNING	Elevated heart rate detected	t	2025-12-29 10:32:54.195
d71a7aca-cc18-4f43-94f3-a04141c86988	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	b602ed12-f3ff-4b25-9838-ff81f4b8de50	HEART_RATE	180	WARNING	Elevated heart rate detected	t	2025-12-30 07:09:28.857
\.


--
-- Data for Name: Device; Type: TABLE DATA; Schema: public; Owner: wintense
--

COPY public."Device" (id, name, type, "userId", "createdAt") FROM stdin;
4ab1e27b-aa94-4896-a517-8d0b2dd7c609	My Watch	MOCK_WATCH	1352fde5-9aa4-4c78-9356-946208a6000a	2025-12-17 09:56:20.428
46179afd-701d-4b8d-9862-64dedd855ef6	Test Watch	MOCK_WATCH	26ba4bbc-7de4-4516-9537-5f132fb7d51e	2025-12-17 10:42:34.075
23c092ee-e6ba-4f52-97ac-e7dd466a7db0	boat	MOCK_WATCH	a279d9b2-fec2-4db6-921c-155290ef75c9	2025-12-18 05:08:19.072
a4e21caa-a772-4d4b-b004-43f4f85d8119	boat	MOCK_WATCH	a83d735e-a071-4b26-8aac-dbab477c0292	2025-12-18 05:41:01.099
063bb4e3-2654-4a5d-a0db-8b8e35306d69	Test Watch	MOCK_WATCH	cd0c2813-5c42-48c2-84cb-59643aced6b9	2025-12-18 10:01:12.756
7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	wintensecare	MOCK_WATCH	24455c80-6f92-42e6-bfb2-b5850350ca93	2025-12-18 11:05:33.708
6d3bc7e0-e8fd-4afa-a5b0-7dfee698b872	wintensecare	MOCK_WATCH	24455c80-6f92-42e6-bfb2-b5850350ca93	2025-12-18 11:06:23.266
b602ed12-f3ff-4b25-9838-ff81f4b8de50	watch_wintensecare	MOCK_WATCH	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	2025-12-22 07:31:49.711
0bb4c438-46e4-4d61-8c51-eb37f14f6afb	My Watch	MOCK_WATCH	c8d2b9ca-0e52-4dcb-a8c0-48c72dbaf67e	2025-12-23 05:02:19.977
360b9804-f367-420b-8f4e-1f21daeca455	My Watch	MOCK_WATCH	c8d2b9ca-0e52-4dcb-a8c0-48c72dbaf67e	2025-12-23 05:02:21.668
d193e41c-96cc-4cfc-99fa-92d3d4123b57	My Watch	MOCK_WATCH	122d6ed6-96ba-4aee-b00f-692a91696c2e	2025-12-23 06:11:55.363
a704ed74-1a62-4147-a172-cea5ba60a845	My Watch	MOCK_WATCH	122d6ed6-96ba-4aee-b00f-692a91696c2e	2025-12-23 06:11:55.407
bd79f229-4c9f-453e-a8eb-1c21c9bd171f	ai	MOCK_WATCH	ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	2025-12-30 06:17:23.021
\.


--
-- Data for Name: Telemetry; Type: TABLE DATA; Schema: public; Owner: wintense
--

COPY public."Telemetry" (id, "deviceId", "heartRate", steps, battery, "createdAt") FROM stdin;
d96c9664-c847-41a6-b3f4-0ba2029a805b	a4e21caa-a772-4d4b-b004-43f4f85d8119	78	150	90	2025-12-18 05:42:07.24
386134f5-4381-41da-ba41-468e132a3421	a4e21caa-a772-4d4b-b004-43f4f85d8119	72	150	90	2025-12-18 05:42:41.957
627d2b67-ffc2-4434-bfb4-e0b658a36efe	a4e21caa-a772-4d4b-b004-43f4f85d8119	72	50	60	2025-12-18 05:45:35.018
11f4f5b1-c874-456b-9fb4-6c421785e5cc	a4e21caa-a772-4d4b-b004-43f4f85d8119	82	770	50	2025-12-18 05:45:47.336
b173a8dc-c8ce-4b2e-af83-c4117630a8b0	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	190	5	50	2025-12-18 08:03:41.893
05f72be9-de8e-4734-b5e5-0a40cb718a9f	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	2000	5	40	2025-12-18 08:03:57.11
c81afce7-00a2-4374-a317-7b7f8c9725c6	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	200	50	4	2025-12-18 08:04:12.707
8f174681-e4eb-4262-8c8e-95961959f0ac	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	190	220	40	2025-12-18 08:05:50.516
930b9c50-b543-40fc-a0bd-d1963d2ccf67	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	190	220	40	2025-12-18 08:06:57.631
2707f687-a388-4540-8126-a0640f4e81b3	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	200	220	40	2025-12-18 08:07:10.081
bbd1167f-d36c-413e-98d7-f159267357a0	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	200	20	40	2025-12-18 08:07:55.75
163b25c7-d705-4586-a907-059d5f9a0a11	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	200	7	40	2025-12-18 08:08:48.114
2d244fdc-b632-49d8-8af8-10cc7b20d1c9	23c092ee-e6ba-4f52-97ac-e7dd466a7db0	200	7	40	2025-12-18 08:09:23.783
4178c43b-68b9-4a40-a7e5-305e2d5cd122	063bb4e3-2654-4a5d-a0db-8b8e35306d69	190	5	50	2025-12-18 10:02:41.426
9671f638-b024-4731-aa54-5c5ad3cb85c6	063bb4e3-2654-4a5d-a0db-8b8e35306d69	190	5	8	2025-12-18 10:03:17.783
6132b19b-9635-4b64-8d41-fff51967573b	063bb4e3-2654-4a5d-a0db-8b8e35306d69	190	23	50	2025-12-18 10:03:34.733
74b36730-5c7e-4ad5-ab3f-45ee71a7b40d	063bb4e3-2654-4a5d-a0db-8b8e35306d69	290	23	50	2025-12-18 10:04:16.62
da50f439-fffa-4817-b518-3098c501d757	063bb4e3-2654-4a5d-a0db-8b8e35306d69	290	5	50	2025-12-18 10:15:22.953
eb9101f5-dbc8-4773-abd5-990cfc9fe907	063bb4e3-2654-4a5d-a0db-8b8e35306d69	290	5	50	2025-12-18 10:25:23.959
1133db7e-3937-482c-8084-68fe941acb14	063bb4e3-2654-4a5d-a0db-8b8e35306d69	290	5	50	2025-12-18 10:25:27.657
b5cbad88-deca-48cf-8d2f-b6f365c85f06	063bb4e3-2654-4a5d-a0db-8b8e35306d69	200	5	50	2025-12-18 10:25:32.945
3a306953-817d-46c1-a817-3a06b0616281	7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	140	5	50	2025-12-18 11:09:00.671
9f35ca67-b1b0-489a-9c47-e4e0a5c5e5ff	7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	110	50	50	2025-12-18 11:09:17.037
9079b8d7-6509-41d6-bc1c-4afa80ff0afc	7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	170	70	49	2025-12-18 11:09:29.473
c8b8fbb2-cfc6-4fc6-bac0-3a11d4d7c791	7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	170	70	49	2025-12-18 11:13:40.631
b8640a2a-7a39-41ce-83fd-5cc0698bd15f	7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	190	70	49	2025-12-18 11:17:49.013
5e5ceb76-ab13-43c9-a4cf-b80b922be0da	7d842d84-f2fa-4f7c-9be5-d5d55d7c48cc	190	70	49	2025-12-18 11:17:58.375
68a980ce-19cc-4e05-98ef-a62603fa6d9e	b602ed12-f3ff-4b25-9838-ff81f4b8de50	180	12	60	2025-12-22 07:34:57.426
5aad27d1-8b7d-496b-9211-b5d8410717cf	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	19	60	2025-12-22 07:35:14.651
2d6ff2fe-de89-412b-86f8-41bb5bd4a9be	b602ed12-f3ff-4b25-9838-ff81f4b8de50	200	24	59	2025-12-22 07:35:25.17
9a049b4f-5cef-4833-b3f0-089aeab0eb52	b602ed12-f3ff-4b25-9838-ff81f4b8de50	80	40	58	2025-12-22 07:35:40.668
6d6b3c28-dbdd-467e-ae95-d6fd50708555	b602ed12-f3ff-4b25-9838-ff81f4b8de50	230	300	39	2025-12-23 06:29:11.097
64522801-1bcb-42cb-ad46-e1e16411d6d8	b602ed12-f3ff-4b25-9838-ff81f4b8de50	230	400	29	2025-12-23 06:31:37.972
19fad030-c173-4379-be57-3c6795629476	b602ed12-f3ff-4b25-9838-ff81f4b8de50	80	600	38	2025-12-23 07:49:01.067
c5c8a0f1-f308-4106-a214-6ce4d4b0a019	b602ed12-f3ff-4b25-9838-ff81f4b8de50	90	600	38	2025-12-23 07:49:30.347
e64aa307-5336-448f-8a77-8d5255db79c0	b602ed12-f3ff-4b25-9838-ff81f4b8de50	90	600	38	2025-12-23 07:49:41.958
208b0aef-3c9f-46f5-a5e5-87b7df0cdc87	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	5	50	2025-12-24 04:40:14.833
b8693f61-0742-4ecc-975c-6a87b9bd52a4	b602ed12-f3ff-4b25-9838-ff81f4b8de50	160	56	50	2025-12-24 04:40:24.277
1f9d8989-7430-4c17-90df-b7a18b00af96	b602ed12-f3ff-4b25-9838-ff81f4b8de50	290	5	50	2025-12-24 04:42:43.613
76bf470d-5947-4906-a423-6c5562348a63	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	5	50	2025-12-24 05:57:42.94
72af47fb-1c0d-42c6-ae68-12446a981c86	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	5	50	2025-12-24 07:23:03.659
777b3b4d-7d66-4f79-9319-8d9a4e2c0b59	b602ed12-f3ff-4b25-9838-ff81f4b8de50	140	30	45	2025-12-24 07:23:15.975
a64d7f29-4882-406c-9afb-c1963b227a59	b602ed12-f3ff-4b25-9838-ff81f4b8de50	140	40	45	2025-12-24 07:23:26.352
76e259e1-b184-4fc4-8c57-d52dc561bcec	b602ed12-f3ff-4b25-9838-ff81f4b8de50	240	40	45	2025-12-24 07:25:15.304
4ba25bca-46eb-4917-a1bf-d26e576416f0	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	5	50	2025-12-24 09:58:22.616
9da4b62d-c926-48f5-9fce-9ae477f3876c	b602ed12-f3ff-4b25-9838-ff81f4b8de50	175	44	50	2025-12-24 10:15:27.985
92aa60ab-9a1c-4d2b-9a74-6a6d837263d2	b602ed12-f3ff-4b25-9838-ff81f4b8de50	175	44	50	2025-12-24 10:38:12.486
b7e71637-6c85-4860-8029-cc277575ceca	b602ed12-f3ff-4b25-9838-ff81f4b8de50	140	50	50	2025-12-26 05:23:34.781
57e21cef-9a0d-47af-99e3-d772b2a85d6b	b602ed12-f3ff-4b25-9838-ff81f4b8de50	170	60	50	2025-12-26 05:24:10.676
1fb035cc-1175-473b-b91d-97aab50b6057	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	90	50	2025-12-26 05:24:22.46
c9c66e40-9a1b-4c11-8cbc-b98985461fdf	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	5	50	2025-12-26 07:06:03.937
499d2a21-675c-42c7-91a4-6724fc726beb	b602ed12-f3ff-4b25-9838-ff81f4b8de50	190	5	5	2025-12-29 10:32:43.883
bdbde20a-de69-4b72-b27a-b250f187eac6	b602ed12-f3ff-4b25-9838-ff81f4b8de50	170	50	44	2025-12-29 10:32:54.154
9515e773-9621-479d-89f1-16531ad45a44	b602ed12-f3ff-4b25-9838-ff81f4b8de50	270	90	44	2025-12-29 10:33:04.682
3299d0a9-94bc-4d1b-8525-49247f0c59d2	b602ed12-f3ff-4b25-9838-ff81f4b8de50	180	10	50	2025-12-30 07:09:28.82
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: wintense
--

COPY public."User" (id, email, password, role, "createdAt", phone) FROM stdin;
1352fde5-9aa4-4c78-9356-946208a6000a	test@mail.com	$2b$10$yqvL1GBfItcM7U1WcQMskuzYjXYqDURc.duzw35oDzVL3a0xtQXsq	user	2025-12-17 08:13:20.09	\N
da1ddeec-b448-44ee-9391-248ecf54cff2	testtest@mail.com	$2b$10$COcwhTJumwQBsrbbGP246.Y1ckIglVXibjSjQwjjJmBJ6oGOxBH6u	user	2025-12-17 08:16:18.384	\N
26ba4bbc-7de4-4516-9537-5f132fb7d51e	email1@test.com	$2b$10$aSTgh1V23maLvqf5bCF8cu/pyakmhM5ujTAhok9u4Ek91JU0xrNxu	user	2025-12-17 10:12:18.104	\N
2a4b351a-5fe3-4d63-aa6a-c53951500a82	emaill1@test.com	$2b$10$xMKYNfxBDwClAwMlmLeNIeAdteqRi.mlYKkWXiRhiWSBhLySRjU72	user	2025-12-17 10:13:09.623	\N
f26c84c8-fa48-4c48-8506-68fbf1fa68ee	\N	$2b$10$CVpSE8CLV34cP39deP3c1uFXrbfEb1GcGBcAv8A7fO6JyYRHUGWYS	user	2025-12-17 10:32:53.114	+919876543210
6063cfb7-a5c7-4c9e-8007-00c9a3d0d0ce	testt@mail.com	$2b$10$A0eGId1uqQlgDKxZ3/gyoeXFrFlmOrUM/X2HtCXs28ShMK8Yexizm	user	2025-12-18 05:02:07.364	\N
e71b05e5-c789-48f0-ad35-ca3563db135a	testttt@mail.com	$2b$10$7m/VvP/xh332pxmYur9HZezF/zXMxewFauneQxs4e5uNVvWpP1SXK	user	2025-12-18 05:02:36.286	\N
a279d9b2-fec2-4db6-921c-155290ef75c9	testtt@mail.com	$2b$10$H6tJ8HCnl6rEqjjRVYgBL.z7a5FpAH/2prVfiDf36ibQ6IhR/NZW6	user	2025-12-18 05:05:20.56	\N
a83d735e-a071-4b26-8aac-dbab477c0292	tt@mail.com	$2b$10$ghx.hDGSxDZ2Hy4gf7ujb.J8Suel1xLG2UrNdNs1QsFWWeJhuOtKC	user	2025-12-18 05:38:48.873	\N
94420a95-fc5b-4f6c-b3f1-9a1ebba1f625	t@mail.com	$2b$10$p0qmKUa.eW4hpdy0k5Nekumsh6o14YmMqm5uthkTMnqYi0Oil44H6	user	2025-12-18 06:27:48.206	\N
9a57749f-f70a-4bd7-9d81-0043480b8199	powmik@gmail.com	$2b$10$kXfQIUwN3hO2r2JecGOy.OLtr3qndXrDiMHPN0CSMAW95zZm6NaZq	user	2025-12-18 06:29:44.119	\N
a900f184-5858-465b-b24f-e255734b8393	dikite@gmail.com	$2b$10$7MtsFAYB2cnftPCdt0TqL.0G9X1MKtyh0gtux85QUc3YBVx.vKv2m	user	2025-12-18 06:37:43.065	\N
3c197622-303e-4c92-827a-308e3ffd133d	irfan@gmail.com	$2b$10$YkD4kW.z215vh6NqE6bKxuVCb26HjBswzPeqp8v4z7hAD2oAPYnh.	user	2025-12-18 06:38:16.597	\N
5f8be284-7501-4f45-beae-21af106651fa	helo@gmail.com	$2b$10$WvDGpGlvnsu5yl34KB1UIeNLAxLasQc4n2LbFIm/EWfdX7I/Z81fG	user	2025-12-18 06:49:25.411	\N
cd0c2813-5c42-48c2-84cb-59643aced6b9	testuser@example.com	$2b$10$94GpEEuFSLfK7ycU0rQlsujTnZDPRfKUVfKKOxkylpMgy8f7.VEXW	user	2025-12-18 09:59:58.799	\N
b175358d-449e-49aa-8e2e-7476a066ee1f	kpk@gmail.com	$2b$10$jGM1aI7wXFguhOWIh51w1.QgudOO4htIZcAA1amiS4R4SXlBxxqr2	user	2025-12-18 10:22:42.824	\N
24455c80-6f92-42e6-bfb2-b5850350ca93	tetuser@example.com	$2b$10$gTyxVpv5qDVDKAi4nWDeOu.gCYFd8tJWKYHkXoAxShL3Xlg4t7PPu	user	2025-12-18 11:01:10.857	\N
6c564f00-64e1-4afe-b7e7-2cd282656482	pow@gmail.com	$2b$10$Yi.PZ7AA65V4RoIb46seI.Glgiuirgyse9D0kKeG6jNvSm7iQZDJq	user	2025-12-19 05:27:14.669	\N
9430ce00-c1d5-4c70-8eef-1232dece523a	powm@gmail.com	$2b$10$187GkxzyF2wbkcGO6OTRJuTCBFHfDiXOcXBuvp4hb6XhTGJdnlvbW	user	2025-12-19 05:49:12.723	\N
c8fcd275-0382-4538-91c9-7b9371eb8d34	ahamedi987@gmail.com	$2b$10$zh/gOfnqXkucQDHMZ9DzHuPllO6I/oQM0WzOURgkG1ptTCC3yMi66	user	2025-12-22 05:04:06.761	\N
eb50d4c5-22ad-4eaf-8a40-cde000cc13bd	ahamedirfan@mail.com	$2b$10$zXgFDz1ClMESftTRcP7e5ukyIJFqNabuxhZ4j4UwbtzzJYO.yQxzi	user	2025-12-22 05:09:00.188	\N
ec9f5e51-59f6-4315-8e6a-acfb5a9b66da	aham@gmail.com	$2b$10$PLIpqCd.uuUDfKIEHCbJSOid15WL1.DvyzTTqdw8zvbncmKmhn/Ta	user	2025-12-22 05:09:54.808	\N
ba0f42a6-41e8-4868-ac41-e71af0a57682	\N	$2b$10$AmsEfPu24akOxI5Y.iNJsufM6wLlVL8l2VGqckNPcOSrs9FLYODH6	user	2025-12-22 06:07:34.267	9123456789
18c2562e-7294-49d2-822e-eb2f9b80939f	powmi@gmail.com	$2b$10$5inz.qJJxlSEP1xldO5PJ.bnTPGzfVZP2UMtyXPazR797eYCqAvrm	user	2025-12-22 06:22:16.999	\N
c8d2b9ca-0e52-4dcb-a8c0-48c72dbaf67e	ka@gmail.com	$2b$10$jEoiA7DDE7SvQNeVRJvHpexr/WcRNfD6Vd9B.hKMh9c3o.7/oF1Ja	user	2025-12-23 04:55:49.875	\N
122d6ed6-96ba-4aee-b00f-692a91696c2e	al@gmail.com	$2b$10$CgFQGqN1RuDpgzduWK0GkuSPU6HfwadmeuPJye2oyKuAr.MurI0BW	user	2025-12-23 05:45:23.881	\N
231db93f-ea46-4ec6-bd6d-fbf1e8c84891	aha@mail.com	$2b$10$cXlcqNGzcmp4QdqGQ9JrhuevJh8QQ3c4QuMsvb/ZqO5Z0jtAF6Mye	user	2025-12-29 06:16:37.933	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: wintense
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
abeed0c4-53bf-477d-8c7b-0202f9ba4efc	bf90a4d5603b4e1316b8d4b2998fe58f764dd149b2d7be8acafa71d001d52a27	2025-12-17 07:47:25.369629+00	20251217074725_init	\N	\N	2025-12-17 07:47:25.31177+00	1
13d4116a-d4f6-459b-b79d-56676f6d9cc0	3dfb2759167aa69bb76475746ddf6c186ddca2f57f0c16d57687467c46b8e431	2025-12-17 10:32:45.309048+00	20251217103245_add_phone_to_user	\N	\N	2025-12-17 10:32:45.265577+00	1
d4d99e7d-c504-42f5-aafc-c602f35fa60c	7457cfb5651c40fc28c50eaf35b4ad97d053d9f9899089c035dd64254dcf0670	2025-12-18 04:47:29.94022+00	20251218044729_telemetry_init	\N	\N	2025-12-18 04:47:29.824438+00	1
2a87f3f7-b95e-40ee-9a7b-140952014713	5da46837acb5e82667f741cf7ba3b911aa14dcb8c0ad28862e4de8129738bd06	2025-12-18 07:19:25.781461+00	20251218071925_alerts_init	\N	\N	2025-12-18 07:19:25.67322+00	1
\.


--
-- Name: Alert Alert_pkey; Type: CONSTRAINT; Schema: public; Owner: wintense
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_pkey" PRIMARY KEY (id);


--
-- Name: Device Device_pkey; Type: CONSTRAINT; Schema: public; Owner: wintense
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_pkey" PRIMARY KEY (id);


--
-- Name: Telemetry Telemetry_pkey; Type: CONSTRAINT; Schema: public; Owner: wintense
--

ALTER TABLE ONLY public."Telemetry"
    ADD CONSTRAINT "Telemetry_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: wintense
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: wintense
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: wintense
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: wintense
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: Device Device_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wintense
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Telemetry Telemetry_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wintense
--

ALTER TABLE ONLY public."Telemetry"
    ADD CONSTRAINT "Telemetry_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public."Device"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict KC14WypOHnN8FImcMOBXfLfvHkahYnRMGdm1abVY9VnEYEY29Du6JTt9RZ3tfS8

--
-- PostgreSQL database cluster dump complete
--

