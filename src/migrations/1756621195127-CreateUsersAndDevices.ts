import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndDevices1756621195127 implements MigrationInterface {
    name = 'CreateUsersAndDevices1756621195127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "nickname" character varying(50) NOT NULL, "birth" character varying(8) NOT NULL, "encrypted_master_key" bytea NOT NULL, "salt" bytea NOT NULL, "nonce" bytea NOT NULL, "algo" character varying(16) NOT NULL DEFAULT 'AES-GCM', "kdf" character varying(16) NOT NULL DEFAULT 'PBKDF2', "digest" character varying(16) NOT NULL DEFAULT 'SHA-256', "iterations" integer NOT NULL DEFAULT '310000', "key_length" integer NOT NULL DEFAULT '32', "schema_version" character varying(16), "is_email_verified" boolean NOT NULL DEFAULT false, "is_sms_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6c8546ee65ea4ca93b84b24d2" ON "user" ("birth") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e2364281027b926b879fa2fa1e" ON "user" ("nickname") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "user_device" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_id" character varying(255) NOT NULL, "device_name" character varying(255), "public_key" text, "registered_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4875276d131a82b6792e73b9b1" ON "user_device" ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2da87388f5c1a960b375dc79ee" ON "user_device" ("device_id") `);
        await queryRunner.query(`ALTER TABLE "user_device" ADD CONSTRAINT "FK_4875276d131a82b6792e73b9b1a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_device" DROP CONSTRAINT "FK_4875276d131a82b6792e73b9b1a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2da87388f5c1a960b375dc79ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4875276d131a82b6792e73b9b1"`);
        await queryRunner.query(`DROP TABLE "user_device"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e1f623798118e629b46a9e629"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2364281027b926b879fa2fa1e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6c8546ee65ea4ca93b84b24d2"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
