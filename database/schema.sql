CREATE TABLE public.attendance_periods (
	id uuid NOT NULL,
	start_date date NOT NULL,
	end_date date NOT NULL,
	created_by uuid NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	ip_address text NULL,
	total_working_days int4 DEFAULT 0 NOT NULL,
	CONSTRAINT attendance_periods_pkey PRIMARY KEY (id),
	CONSTRAINT attendance_periods_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);

CREATE TABLE public.attendances (
	id uuid NOT NULL,
	user_id uuid NULL,
	"date" date NOT NULL,
	period_id uuid NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	created_by uuid NULL,
	updated_by uuid NULL,
	ip_address varchar(50) NULL,
	check_in timestamptz NULL,
	check_out timestamptz NULL,
	CONSTRAINT attendances_pkey PRIMARY KEY (id),
	CONSTRAINT attendances_user_id_date_key UNIQUE (user_id, date),
	CONSTRAINT attendances_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
	CONSTRAINT attendances_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.attendance_periods(id),
	CONSTRAINT attendances_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id),
	CONSTRAINT attendances_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.audit_logs (
	id uuid NOT NULL,
	request_path text NOT NULL,
	payload text NULL,
	user_id uuid NULL,
	ip_address varchar(50) NULL,
	request_id uuid NULL,
	"timestamp" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
	CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.overtimes (
	id uuid NOT NULL,
	user_id uuid NULL,
	"date" date NOT NULL,
	start_time time NOT NULL,
	end_time time NOT NULL,
	duration_minutes int4 NULL,
	period_id uuid NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	created_by uuid NULL,
	updated_by uuid NULL,
	ip_address varchar(50) NULL,
	CONSTRAINT overtimes_duration_check CHECK (((duration_minutes > 0) AND (duration_minutes <= 180))),
	CONSTRAINT overtimes_pkey PRIMARY KEY (id),
	CONSTRAINT overtimes_time_check CHECK ((end_time > start_time)),
	CONSTRAINT overtimes_user_id_date_key UNIQUE (user_id, date),
	CONSTRAINT overtimes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
	CONSTRAINT overtimes_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.attendance_periods(id),
	CONSTRAINT overtimes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id),
	CONSTRAINT overtimes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.payroll_details (
	id uuid NOT NULL,
	payroll_id uuid NOT NULL,
	user_id uuid NOT NULL,
	base_salary numeric(15, 2) NOT NULL,
	attendance_days int4 NOT NULL,
	total_attendance_days int4 NOT NULL,
	prorated_salary numeric(15, 2) NOT NULL,
	overtime_minutes int4 DEFAULT 0 NULL,
	overtime_pay numeric(15, 2) DEFAULT 0 NULL,
	reimbursement_total numeric(15, 2) DEFAULT 0 NULL,
	take_home_pay numeric(15, 2) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT payroll_details_pkey PRIMARY KEY (id),
	CONSTRAINT payroll_details_unique UNIQUE (payroll_id, user_id),
	CONSTRAINT payroll_details_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id),
	CONSTRAINT payroll_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.payrolls (
	id uuid NOT NULL,
	period_id uuid NOT NULL,
	processed_by uuid NULL,
	processed_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	created_by uuid NULL,
	updated_by uuid NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	ip_address varchar(50) NULL,
	CONSTRAINT payrolls_period_id_key UNIQUE (period_id),
	CONSTRAINT payrolls_pkey PRIMARY KEY (id),
	CONSTRAINT payrolls_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
	CONSTRAINT payrolls_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.attendance_periods(id),
	CONSTRAINT payrolls_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id),
	CONSTRAINT payrolls_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id)
);

CREATE TABLE public.reimbursements (
	id uuid NOT NULL,
	user_id uuid NULL,
	amount numeric(15, 2) NOT NULL,
	description text NULL,
	period_id uuid NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	created_by uuid NULL,
	updated_by uuid NULL,
	ip_address varchar(50) NULL,
	CONSTRAINT reimbursements_pkey PRIMARY KEY (id),
	CONSTRAINT reimbursements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
	CONSTRAINT reimbursements_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.attendance_periods(id),
	CONSTRAINT reimbursements_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id),
	CONSTRAINT reimbursements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.users (
	id uuid NOT NULL,
	username varchar(50) NOT NULL,
	"password" text NOT NULL,
	full_name varchar(100) NULL,
	"role" varchar(10) NOT NULL,
	salary numeric(15, 2) DEFAULT 0 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'employee'::character varying])::text[]))),
	CONSTRAINT users_username_key UNIQUE (username)
);